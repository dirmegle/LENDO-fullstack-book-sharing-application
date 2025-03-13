import { trpc } from '@/trpc'
import { NotificationWithISOCreatedAt } from '@server/entities/notification'
import { User } from '@server/shared/types'
import { useEffect, useState } from 'react'
import UserProfilePic from '@/assets/icons/userProfilePic.svg?react'
import { useNavigate } from 'react-router-dom'
import AbstractBlack from '@/assets/icons/abstractBlack.svg?react'
import AbstractTwo from '@/assets/icons/abstractTwo.svg?react'

interface NotificationProps {
  notification: NotificationWithISOCreatedAt
}

function Notification({ notification }: NotificationProps) {
  const [authorUser, setAuthorUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getAuthorUser = async () => {
      const user = await trpc.user.getUserById.query({ id: notification.triggeredById })
      setAuthorUser(user)
    }

    getAuthorUser()
  })

  useEffect(() => {
    const updateNotification = async () => {
      if(!notification.isRead) {
        try {
          await trpc.notification.setNotificationAsRead.mutate({id: notification.id})
        } catch (e) {
          console.error(e)
        }
      }
    }
    updateNotification()
  })

  const getLink = () => {
    switch (notification.entityType) {
      case 'friendship':
        return '/friends'
      case 'reservation':
        return '/reservations'
    }
  }

  const getElement = () => {
    return notification.isRead ? (
      <AbstractBlack className="w-full h-full" />
    ) : (
      <AbstractTwo className="w-full h-full" />
    )
  }

  return (
    authorUser && (
      <div
        onClick={() => navigate(getLink())}
        className="flex flex-row items-center justify-between hover:bg-accent-purple/20 transition ease-in-out duration-300 cursor-pointer p-4"
      >
        <div className="flex flex-row items-center">
          <div className="border border-border md:w-12 md:h-12 md:min-h-12 md:min-w-12 h-10 w-10 min-h-10 min-w-10 bg-accent-purple mr-4">
            <UserProfilePic className="w-full h-full" />
          </div>
          <div>
            <p className='text-sm md:text-lg'>{notification.message}</p>
          </div>
        </div>
        <div className="md:h-10 md:w-10 h-5 w-5 min-h-5 min-w-5">{getElement()}</div>
      </div>
    )
  )
}

export default Notification
