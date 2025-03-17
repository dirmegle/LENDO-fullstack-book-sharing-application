import { cn } from '@/lib/utils'
import { removeAccessTokenCookie } from '@/utils/isAuthenticated'
import { useState } from 'react'
import userProfilePicUrl from '@/assets/icons/userProfilePic.svg'

interface UserProfileHandlerProps {
  isExpanded: boolean
}

export default function UserProfileHandler({ isExpanded }: UserProfileHandlerProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const handleProfileClick = () => {
    setIsMenuVisible(prev => !prev)
  }

  const handleSignout = () => {
    removeAccessTokenCookie()
    window.location.reload()
  }

  return (
    <div className="relative">
      {isMenuVisible && (
        <div className="absolute bottom-full left-0 w-40 p-1 bg-primary text-background border border-border z-10 transition ease-in-out duration-300">
          <button onClick={handleSignout} className='w-full hover:bg-primary/80'>Sign out</button>
        </div>
      )}
      <button
        onClick={handleProfileClick}
        className={cn(
          'flex items-center gap-2 rounded-md text-primary mb-4 text-md hover:bg-muted-green transition-all duration-100 ease-in-out w-full p-1',
          isMenuVisible && 'outline outline-[1px] outline-border bg-accent-green shadow-[3px_3px_#141414]'
        )}
      >
        <div className="w-[30px] h-[30px]">
          <img src={userProfilePicUrl} alt='user profile icon' />
        </div>
        <span className={cn(!isExpanded && 'hidden')}>My profile</span>
      </button>
    </div>
  )
}
