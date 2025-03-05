import { User, UserWithFriendship } from '@server/shared/types'
import { Input } from './Input'
import { useRef, useState } from 'react'
import { trpc } from '@/trpc'
import Loader from './Loader/Loader'
import FriendProfile from './FriendProfile'
import { Separator } from './Separator'
import { Button } from './Button'
import { useToast } from '@/hooks/useToast'

interface FriendsSearchProps {
  existingFriends: UserWithFriendship[]
}

export default function FriendSearch({ existingFriends }: FriendsSearchProps) {
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Track local pending invites
  const [localPendingIds, setLocalPendingIds] = useState<string[]>([])

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>
  ) => {
    let inputValue: string

    if ('clipboardData' in e) {
      inputValue = e.clipboardData.getData('text')
    } else {
      inputValue = e.target.value
    }

    setSearchValue(inputValue)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (inputValue === '') {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const users = await trpc.user.getUsersByName.query({ name: searchValue })
        const filteredUsers = users.filter((user) => !getAcceptedFriendIds().includes(user.id))
        setResults(filteredUsers)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  const getAcceptedFriendIds = () => {
    return existingFriends
      .filter((friend) => friend.status === 'accepted')
      .flatMap((friend) => friend.userId)
  }

  const getPendingFriendIds = () => {
    return existingFriends
      .filter((friend) => friend.status === 'pending')
      .flatMap((friend) => friend.userId)
  }

  const handleInvitationSending = async (user: User) => {
    // Immediately mark the user as "locally pending" to disable the button
    setLocalPendingIds((prev) => [...prev, user.id])

    try {
      await trpc.friendship.sendFriendRequest.mutate({ toUserId: user.id })
      toast({
        title: `Friendship request to ${user.firstName} ${user.lastName} has been sent`,
      })
    } catch {
      // If the request fails, remove the user from localPendingIds to re-enable the button
      setLocalPendingIds((prev) => prev.filter((id) => id !== user.id))
      toast({
        title: `Something went wrong.`,
        description: 'Try again later or contact support',
      })
    }
  }

  return (
    <div>
      <h2 className="font-medium my-2">Find users:</h2>
      <div>
        <Input
          placeholder="Search user name"
          value={searchValue}
          onChange={handleInputChange}
          className="mb-4"
        />
        {searchValue !== '' && (isLoading || results.length > 0) && (
          <div>
            {isLoading && <Loader />}
            <div className="flex flex-col gap-2">
              {results.length > 0 &&
                results.map((user) => {
                  const isDisabled =
                    getPendingFriendIds().includes(user.id) ||
                    localPendingIds.includes(user.id)

                  return (
                    <div
                      key={user.id}
                      className="border border-border p-2 flex flex-row items-center justify-between"
                    >
                      <FriendProfile {...user} />
                      <Button
                        onClick={() => handleInvitationSending(user)}
                        disabled={isDisabled}
                      >
                        Send invite
                      </Button>
                    </div>
                  )
                })}
            </div>
            <Separator className="my-4" />
          </div>
        )}
      </div>
    </div>
  )
}
