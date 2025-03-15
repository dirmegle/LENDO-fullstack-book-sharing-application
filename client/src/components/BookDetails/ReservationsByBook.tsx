import { Book, BookCopy, ReservationWithISOString } from '@server/shared/types'
import { Separator } from './../Separator'
import { trpc } from '@/trpc'
import useUserContext from '@/context/UserContext'
import { useEffect, useState } from 'react'
import ReservationRow from '../ReservationRow'
import { Button } from '../Button'
import ArrowUp from '@/assets/icons/arrowUp.svg?react'
import ArrowDown from '@/assets/icons/arrowDown.svg?react'
import ReservationHandler from '../ReservationHandler'
import NoResultsMessage from '../NoResultsMessage'
import illustrationBookDetailsReservation from '@/assets/images/illustrationBookDetailReservations.png'
import illustrationReservationsFromFriends from '@/assets/images/illustrationReservationsFromFriends.png'
import illustrationAvailableReservations from '@/assets/images/illustrationAvailableReservations.png'

interface ReservationsByBookProps {
  book: Book
}

export default function ReservationsByBook({ book }: ReservationsByBookProps) {
  const [activeReservationsForOwner, setActiveReservationsForOwner] = useState<ReservationWithISOString[]>([])
  const [activeReservationsForNonOwner, setReservationsForNonOwner] = useState<ReservationWithISOString[]>([])
  const [isReservationWindowVisible, setReservationWindowVisibility] = useState(false)
  const [bookCopiesFromFriends, setBookCopies] = useState<Pick<BookCopy, 'id'>[]>([])
  const { checkIfBookIsInUserList } = useUserContext()

  const isAuthUserOwner = checkIfBookIsInUserList(book.isbn)

  useEffect(() => {
    const getActiveReservationsForOwner = async () => {
      const bookCopyId = await trpc.bookCopy.getBookCopyId.query({ isbn: book.isbn })
      const reservations = await trpc.reservation.getActiveReservationsByBookCopy.query({
        bookCopyId,
      })
      setActiveReservationsForOwner(reservations)
    }

    const getActiveReservationsForNonOwner = async () => {
      const reservations = await trpc.reservation.getReservationsByReserverAndISBN.query({
        isbn: book.isbn,
      })
      setReservationsForNonOwner(reservations)
    }

    const getBookCopiesFromFriends = async () => {
      const bookCopies = await trpc.bookCopy.getBookCopiesFromFriendsByISBN.query({
        isbn: book.isbn,
      })
      setBookCopies(bookCopies)
    }

    getActiveReservationsForNonOwner()
    getActiveReservationsForOwner()
    getBookCopiesFromFriends()
  }, [book.isbn])

  return (
    <div className="sm:w-[80%] w-[100%] mt-4">
      {isAuthUserOwner && (
        <>
          <h3 className="text-2xl text-center md:text-left mb-4 font-medium">Reservations of my copy</h3>
          <div className="flex flex-col gap-2">
            {activeReservationsForOwner.length > 0 ? (
              activeReservationsForOwner.map((reservation) => (
                <ReservationRow reservation={reservation} key={reservation.id} />
              ))
            ) : (
              <NoResultsMessage message="None of your friends have reserved this book yet" illustrationLink={illustrationBookDetailsReservation} />
            )}
          </div>
        </>
      )}
      <h3 className="text-2xl text-center md:text-left my-4 font-medium">Reservations from friends</h3>
      {activeReservationsForNonOwner.length > 0 ? (
        <div className="flex flex-col gap-2">
          {activeReservationsForNonOwner.map((reservation) => (
            <ReservationRow reservation={reservation} key={reservation.id} />
          ))}
        </div>
      ) : (
        <NoResultsMessage message="You haven't reserved this book from anyone yet" illustrationLink={illustrationReservationsFromFriends} />
      )}
      
      <Button
        className="mt-4"
        variant="accentPeach"
        size="full"
        onClick={() => setReservationWindowVisibility(!isReservationWindowVisible)}
      >
        {isReservationWindowVisible ? (
          <>
            <ArrowUp /> Hide reservation options <ArrowUp />
          </>
        ) : (
          <>
            <ArrowDown /> Check if you can reserve the book <ArrowDown />
          </>
        )}
      </Button>
      {isReservationWindowVisible && (
        <div className="transition ease-in-out duration-300">
          {bookCopiesFromFriends.length > 0 ? (
            bookCopiesFromFriends.map((bookCopy) => (
              <ReservationHandler bookCopyId={bookCopy.id} key={bookCopy.id} />
            ))
          ) : (
            <div className='mt-4'>
            <NoResultsMessage message="None of your friends have this book in their library" illustrationLink={illustrationAvailableReservations} />
            </div>
          )}
        </div>
      )}
      <Separator className="mt-5" />
    </div>
  )
}
