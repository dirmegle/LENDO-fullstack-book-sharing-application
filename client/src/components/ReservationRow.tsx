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
import { Dialog, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogContent } from './Dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './Select'
import { useToast } from '@/hooks/useToast'
import BookCover from './BookCover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

interface ReservationProps {
  reservation: ReservationWithISOString
  book: Book
  bookDetails?: boolean
}

type Status = "pending" | "cancelled" | "completed" | "confirmed" | "rejected" 

export default function Reservation({ reservation, bookDetails = true, book }: ReservationProps) {
  const [reservationCopy, setReservationCopy] = useState<ReservationWithISOString>(reservation)
  const [reserverProfile, setReserverProfile] = useState<User | null>(null)
  const [ownerProfile, setOwnerProfile] = useState<User | null>(null)
  const [isDialogVisible, setDialogVisibility] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const { toast } = useToast()
  const { user } = useUserContext()

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

  const isAuthUserOwner = () => {
    console.log(ownerProfile?.id)
    console.log(user?.id)  
    return ownerProfile?.id == user?.id
  }

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
      if (reservationCopy.status === 'pending') {
        return ['confirmed', 'rejected']
      }
      return ['completed', 'cancelled']
    }

    if (reservationCopy.status === 'pending') {
      return ['cancelled']
    }
    return ['cancelled', 'completed']
  }

  const handleStatusUpdate = async () => {
    try {
      await trpc.reservation.updateReservationStatus.mutate({
        id: reservationCopy.id,
        bookCopyId: reservationCopy.bookCopyId,
        status: selectedStatus as Status
      })
      setDialogVisibility(false)
      setReservationCopy((prev) => ({
        ...prev,
        status: selectedStatus as Status,
      }))
      toast({
        title: 'Status updated successfully'
      })
    } catch {
      setDialogVisibility(false)
      toast({
        title: 'Something went wrong',
        description: 'Status could not be updated. Try again or contact support.'
      })
    }
  } 

  return (
    <>
      <Dialog>
          {reserverProfile && ownerProfile && (
          <div className="flex flex-col lg:flex-row border border-border p-4 items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center w-full lg:w-auto justify-center">
              <div className="h-7 w-7 flex-shrink-0 hidden lg:block lg:mr-4">
                {fetchStyleDataBasedOnStatus(reservationCopy.status).element}
              </div>
              {bookDetails && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className='lg:mr-4'>

                      <BookCover {...book} />
                        </div>
                      <TooltipContent>{`${book.title} by ${book.author}`}</TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
              )}
              <div className="mt-2 lg:mt-0 text-center lg:text-left">
                <h6 className="font-medium text-lg">
                  {isAuthUserOwner()
                    ? `Reserved by ${reserverProfile.firstName} ${reserverProfile.lastName}`
                    : `Reserved from ${ownerProfile.firstName} ${ownerProfile.lastName}`}
                </h6>
                <p className="text-lg">
                  {`${formatDate(reservationCopy.startDate)} - ${formatDate(reservationCopy.endDate)}`}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <div className={`uppercase border border-border p-1 font-medium ${fetchStyleDataBasedOnStatus(reservationCopy.status).color}`}>
                {reservationCopy.status}
              </div>
              <DialogTrigger>
                <Button
                  variant="link"
                  onClick={() => setDialogVisibility(true)}
                  disabled={reservationCopy.status === 'cancelled' || reservationCopy.status === 'rejected'}
                >
                  Change status
                </Button>
              </DialogTrigger>
            </div>
          </div>
        )}
        {isDialogVisible && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change reservation status</DialogTitle>
            </DialogHeader>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {getStatusUpdateValues().map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={handleStatusUpdate}>Update</Button>
              <Button variant="outline" onClick={() => setDialogVisibility(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
