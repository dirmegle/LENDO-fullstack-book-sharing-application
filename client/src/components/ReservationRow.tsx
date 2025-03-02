import { trpc } from '@/trpc'
import { formatDate } from '@/utils/formatDate'
import { ReservationWithISOString } from '@server/entities/reservation'
import { Book, User } from '@server/shared/types'
import { useEffect, useState } from 'react'
import ReservationConfirmed from '@/assets/icons/reservationStatus/reservationConfirmed.svg?react'
import ReservationCompleted from '@/assets/icons/reservationStatus/reservationCompleted.svg?react'
import ReservationPending from '@/assets/icons/reservationStatus/reservationPending.svg?react'
import ReservationRejectedCancelled from '@/assets/icons/reservationStatus/reservationRejectedCancelled.svg?react'
import useUserContext from '@/context/UserContext'
import { Button } from './Button'
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from './Dialog'
import { DialogContent } from '@radix-ui/react-dialog'

interface ReservationProps {
  reservation: ReservationWithISOString
  book: Book
  bookDetails?: boolean
}

export default function Reservation({ reservation, bookDetails = false, book }: ReservationProps) {
  const [reserverProfile, setReserverProfile] = useState<User | null>(null)
  const [ownerProfile, setOwnerProfile] = useState<User | null>(null)
  const [isDialogVisible, setDialogVisibility] = useState(false)
  const { user } = useUserContext()

  const isAuthUserOwner = () => ownerProfile?.id === user?.id

  useEffect(() => {
    const getReserverUser = async () => {
      const user = await trpc.user.getUserById.query({ id: reservation.reserverId })
      setReserverProfile(user)
    }

    const getOwnerUser = async () => {
      const user = await trpc.user.getOwnerUserByCopyId.query({ id: reservation.bookCopyId })
      setOwnerProfile(user)
    }

    getReserverUser()
    getOwnerUser()
  }, [reservation.reserverId, reservation.bookCopyId])

  const fetchStyleDataBasedOnStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          element: <ReservationConfirmed className="w-full h-full" />,
          color: 'bg-accent-purple',
        }
      case 'completed':
        return {
          element: <ReservationCompleted className="w-full h-full" />,
          color: 'bg-accent-green',
        }
      case 'pending':
        return {
          element: <ReservationPending className="w-full h-full" />,
          color: 'bg-accent-peach',
        }
      case 'rejected':
      case 'cancelled':
        return {
          element: <ReservationRejectedCancelled className="w-full h-full" />,
          color: 'bg-destructive',
        }
      default:
        return {
          element: <ReservationConfirmed className="w-full h-full" />,
          color: 'bg-accent-purple',
        }
    }
  }

  const getStatusUpdateValues = () => {
    if (isAuthUserOwner()) {
      if (reservation.status === 'pending') {
        return ['confirmed', 'rejected']
      }
      return ['completed', 'cancelled']
    }
    if (reservation.status === 'pending') {
      return ['cancelled']
    }
    return ['cancelled', 'completed']
  }

  return (
    <>
    <Dialog>
      {reserverProfile && ownerProfile && (
        <div className="flex md:flex-row flex-col border border-border p-2 items-center justify-between">
          <div className="flex flex-row items-center">
            <div className="h-7 w-7">{fetchStyleDataBasedOnStatus(reservation.status).element}</div>
            <div className="ml-2">
              <h6 className="font-medium text-md">
                {isAuthUserOwner()
                  ? `Reserved by ${reserverProfile.firstName} ${reserverProfile.lastName}`
                  : `Reserved from ${ownerProfile.firstName} ${ownerProfile.lastName}`}
              </h6>
              <p className="text-sm">{`${formatDate(reservation.startDate)} - ${formatDate(reservation.endDate)}`}</p>
            </div>
          </div>
          <div className='flex flex-row'>
            <div
              className={`uppercase border border-border p-1 font-medium md:mt-0 mt-2 ${fetchStyleDataBasedOnStatus(reservation.status).color}`}
            >
              {reservation.status}
            </div>
            <DialogTrigger>
            <Button variant="link" onClick={() => setDialogVisibility(true)}>Change status</Button>
            </DialogTrigger>
          </div>
        </div>
      )}
      {isDialogVisible && (
        <DialogContent>
          <DialogHeader><DialogTitle>Change reservation status</DialogTitle></DialogHeader>

        </DialogContent>
      )}
      </Dialog>
    </>
  )
}
