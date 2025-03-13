import noCover from '@/assets/images/noCover.png'
import BooksDisplay from '@/components/BooksDisplay'
import Notification from '@/components/Notification'
import { Separator } from '@/components/Separator'
import useUserContext from '@/context/UserContext'
import { trpc } from '@/trpc'
import { NotificationWithISOCreatedAt } from '@server/entities/notification'
import { Book, BookCopy } from '@server/shared/types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, userBookCopies } = useUserContext()
  const [friendsBooks, setFriendsBooks] = useState<BookCopy[]>([])
  const [notifications, setNotifications] = useState<NotificationWithISOCreatedAt[]>([])
  const [dailyRead, setDailyRead] = useState<Book | undefined>(undefined)

  useEffect(() => {
    const getRead = async () => {
      const dailyRead = await trpc.book.getDailyRead.query()
      setDailyRead(dailyRead)
    }

    const getNotifications = async () => {
      const notifications = await trpc.notification.getNotificationsByUser.query()
      setNotifications(notifications)
    }

    const getFriendsBooks = async () => {
        const friendsBooksData = await trpc.bookCopy.getBookCopiesFromFriends.query()
        setFriendsBooks(friendsBooksData)
      }

    getRead()
    getNotifications()
    getFriendsBooks()
  }, [])

  return (
    <div>
      <div>
        <h1 className="text-4xl font-medium">
          {user ? `Hey there, ${user.firstName}!` : 'Hey there!'}
        </h1>
      </div>
      <Separator className="my-4" />
      <div className="mb-8">
        <h2 className="font-medium text-3xl mb-4">See what's new:</h2>
        <div className="border border-border h-content max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => <Notification notification={notification} />)
          ) : (
            <p className="p-4">No notifications yet</p>
          )}
        </div>
      </div>
      {dailyRead && (
        <div className="mb-8">
          <h2 className="font-medium text-3xl mb-4">Discover Lendo read of the day:</h2>
          <div
            onClick={() =>
              navigate(`/books/${dailyRead.isbn.replace(', ', '+')}`, { state: dailyRead })
            }
            className="border border-border p-4 hover:bg-accent-green/90 transition ease-in-out duration-300 cursor-pointer bg-accent-green"
          >
            <div className="flex md:flex-row flex-col gap-4 md:items-start items-center justify-center">
              <div className="md:min-h-[216px] md:min-w-[144px] h-[216px] w-[144px] border">
                <img
                  src={dailyRead.coverImage ? dailyRead.coverImage : noCover}
                  alt={`Cover image for ${dailyRead.title} by ${dailyRead.author}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 justify-center h-full self-center">
                <h3 className="font-medium text-2xl text-center md:text-left">{dailyRead.title}</h3>
                <p className="text-gray-600 text-sm text-center md:text-left">{dailyRead.author}</p>
                <p className="line-clamp-3 text-center md:text-left">{dailyRead.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-8'>
      {userBookCopies && ( <BooksDisplay bookCopies={userBookCopies} title='Browse your library:' link='/books'/> )}
      {friendsBooks && ( <BooksDisplay bookCopies={friendsBooks} title='Browse your friends books:' link='/books'/>)}
      </div>
    </div>
  )
}
