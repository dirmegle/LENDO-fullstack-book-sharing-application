import { Book } from "@server/shared/types";
import { Separator } from "./../Separator";
import { trpc } from "@/trpc";

interface ReservationsByBookProps {
  book: Book
}

export default function ReservationsByBook({book}: ReservationsByBookProps) {

  // TODO: set in one place and retrieve from context
  const isAuthUserOwner = true

  const getActiveReservations = async () => {
    const bookCopyId = await trpc.bookCopy.getBookCopyId.query({isbn: book.isbn})
    const activeReservations = await trpc.reservation.getActiveReservationsByBookCopy.query({ bookCopyId })
    return activeReservations
  }

  return (
    <div className="sm:w-[80%] w-[100%] mt-4">
      <h3 className='text-2xl text-center md:text-left'>Reservations</h3>
      <Separator className="mt-5"/>
    </div>
  )
}
