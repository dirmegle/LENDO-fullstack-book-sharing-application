import { Button } from '@/components/Button'
import FriendProfile from '@/components/FriendProfile'
import FriendSearch from '@/components/FriendSearch'
import { Separator } from '@/components/Separator'
import useUserContext from '@/context/UserContext'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/trpc'
import { UserWithFriendship } from '@server/shared/types'
import { useEffect, useState } from 'react'

export default function FriendsPage() {
  const [friends, setFriends] = useState<UserWithFriendship[]>([])
  const { toast } = useToast()
  const { user } = useUserContext()

  useEffect(() => {
    const getFriends = async () => {
      const friends = await trpc.user.getFriendUsers.query()
      setFriends(friends)
    }

    getFriends()
  }, [])

  const getReceivedPendingFriendships = () => {
    return friends.filter((friend) => friend.status === 'pending' && friend.fromUserId !== user?.id)
  }

  const getExistingFriendships = () => {
    return friends.filter((friend) => friend.status === 'accepted')
  }

  const handleAcceptance = async (friend: UserWithFriendship) => {    
    try {
      await trpc.friendship.updateFriendship.mutate({id: friend.friendshipId, status: 'accepted'})
      toast({
        title: `Friendship request from ${friend.firstName} ${friend.lastName} was accepted`
      })
    } catch {
      toast({
        title: `Something went wrong.`,
        description: 'Try again or contact support',
        variant: 'destructive'
      })
    }
  }

  const handleRejection = async (friend: UserWithFriendship) => {
    try {
      await trpc.friendship.updateFriendship.mutate({id: friend.friendshipId, status: 'declined'})
      toast({
        title: `Friendship request from ${friend.firstName} ${friend.lastName} was declined`
      })
    } catch {
      toast({
        title: `Something went wrong.`,
        description: 'Try again or contact support',
        variant: 'destructive'
      })
    }
  }

  return (
    <div>
      <h1 className="font-medium text-3xl mb-4">Friends</h1>
      <FriendSearch existingFriends={friends}/>
      {getReceivedPendingFriendships().length > 0 && (
        <>
        <h2 className="font-medium my-2">Your pending invites</h2>
        <div className='flex flex-col gap-2'>
          {getReceivedPendingFriendships().map((friend) => (
            <div key={friend.friendshipId} className='border border-border p-2 flex sm:flex-row flex-col sm:justify-between items-center'>
              <FriendProfile {...friend}/>
              <div className='flex sm:flex-row w-full sm:w-44 gap-2 mt-2 sm:mt-0'>
                <Button size='full' variant='accentGreen' onClick={() => handleAcceptance(friend)}>Accept</Button>
                <Button size='full' variant='destructive' onClick={() => handleRejection(friend)}>Decline</Button>
              </div>
            </div>
          ))}
        </div>
        <Separator className='my-4'/>
        </>
      )}
      <div className="border border-border p-2">
        <div>
          {getExistingFriendships().map((friend) => (
            <div key={friend.friendshipId}>
              <FriendProfile {...friend} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
