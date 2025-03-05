import { UserWithFriendship } from '@server/shared/types'
import UserProfilePic from '@/assets/icons/userProfilePic.svg?react'

interface FriendsRowProps {
  firstName: string
  lastName: string
}

export default function FriendRow({ firstName, lastName }: FriendsRowProps) {
  return (
    <div>
      <div className="flex flex-row items-center">
        <div className="border border-border w-12 h-12 bg-accent-purple">
          <UserProfilePic className="w-full h-full" />
        </div>
        <div className="text-primary ml-2">
          <h6 className="font-medium">{`${firstName} ${lastName}`}</h6>
        </div>
      </div>
    </div>
  )
}
