import noCover from '@/assets/images/noCover.png'
import BooksDisplay from '@/components/BooksDisplay'
import Notification from '@/components/Notification'
import useUserContext from '@/context/UserContext'
import { trpc } from '@/trpc'
import { NotificationWithISOCreatedAt } from '@server/entities/notification'
import { Book, BookCopy } from '@server/shared/types'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import illustrationHome from '@/assets/images/illustrationHome.png'
import NoResultsMessage from '@/components/NoResultsMessage'
import illustrationNotification from '@/assets/images/illustrationNotifications.png'

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
      <div className='border border-border p-4 flex lg:flex-row flex-col justify-center items-center gap-8 shadow-[3px_3px_#141414] lg:h-[300px] h-max-content'>
        <div className='flex flex-col gap-2'>

        <h1 className="text-4xl font-medium text-center lg:text-left">
          {user ? `Hey there, ${user.firstName.trim()}!` : 'Hey there!'}
        </h1>
        <p className='text-center lg:text-left'>Let's start reading...</p>
        </div>
        
        <div className='lg:h-[400px] lg:w-[400px] w-full h-auto flex justify-center'>
          <img src={illustrationHome} alt="illustration people sitting together" />
        </div>
      </div>
      <div className="my-8">
        <h2 className="font-medium text-3xl mb-4">See what's new:</h2>
        <div className="border border-border h-content max-h-[300px] overflow-y-auto shadow-[3px_3px_#141414]">
          {notifications.length > 0 ? (
            notifications.map((notification) => <Notification notification={notification} />)
          ) : (
            <NoResultsMessage message='No notifications yet. Add some books and send out some friendship requests!' illustrationLink={illustrationNotification}/>
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
            className="border border-border p-4 hover:bg-accent-green/90 transition ease-in-out duration-300 cursor-pointer bg-accent-green shadow-[3px_3px_#141414]"
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
      {userBookCopies && ( <BooksDisplay noResultsMessage='You have no books in your library. Add some!' bookCopies={userBookCopies} title='Browse your library:' link='/library?activeTab=personal'/> )}
      {friendsBooks && ( <BooksDisplay noResultsMessage='There are no books in your friends library yet.' bookCopies={friendsBooks} title='Browse your friends books:' link='/library?activeTab=friends'/>)}
      </div>
    </div>
  )
}
