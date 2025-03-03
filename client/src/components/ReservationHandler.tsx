import { trpc } from '@/trpc'
import { ReservationWithISOString, User, reservationStatus } from '@server/shared/types'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import { DateRange } from 'react-day-picker'
import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './Calendar'
import useUserContext from '@/context/UserContext'
import { useToast } from '@/hooks/useToast'

interface ReservationHandlerProps {
  bookCopyId: string
}

export default function ReservationHandler({ bookCopyId }: ReservationHandlerProps) {
  const [activeReservations, setActiveReservations] = useState<ReservationWithISOString[]>([])
  const [ownerProfile, setOwnerProfile] = useState<User | null>(null)
  const [date, setDate] = React.useState<DateRange | undefined>()
  const { user } = useUserContext()
  const { toast } = useToast()

  useEffect(() => {
    const getActiveReservations = async () => {
      const reservations = await trpc.reservation.getActiveReservationsByBookCopy.query({
        bookCopyId: bookCopyId,
      })
      setActiveReservations(reservations)
    }

    const getOwnerProfile = async () => {
      const user = await trpc.user.getOwnerUserByCopyId.query({ id: bookCopyId })
      setOwnerProfile(user)
    }

    getOwnerProfile()
    getActiveReservations()
  }, [bookCopyId])

  const getDisabledDates = () => {
    const reservationsArrayCopy = activeReservations
    const ranges = reservationsArrayCopy.map((reservation) => {
      return { from: new Date(reservation.startDate), to: new Date(reservation.endDate) }
    })
    return ranges
  }

  const handleDateSelection = (newRange: DateRange | undefined) => {
    if (newRange && newRange.from && newRange.to) {
      const { from, to } = newRange
      const isRangeInvalid = getDisabledDates().some((range) => {
        return from <= range.to && to >= range.from
      })
      if (isRangeInvalid) {
        toast({
          title: 'Cannot select these dates',
          description: 'The dates overlap with existing reservations',
          variant: 'destructive',
        })
        return
      }
    }
    setDate(newRange)
  }

  const isReservationDuplicating = () => {
    const reserverIds = activeReservations.flatMap((reservation) => reservation.reserverId)
    if (user) {
      console.log(reserverIds)
      return reserverIds.includes(user.id)
    }
  }

  const handleReservationCreation = async () => {
    if (!date || !date.from || !date.to) {
      toast({
        title: 'You must select dates for reservation',
        variant: 'destructive',
      })
      return
    }

    const reservation = {
      bookCopyId,
      startDate: date.from.toISOString(),
      endDate: date.to.toISOString(),
      status: 'pending' as (typeof reservationStatus)[0],
    }

    try {
      if (!isReservationDuplicating()) {
        const createdReservation = await trpc.reservation.createReservation.mutate(reservation)

        if (createdReservation) {
          toast({
            title: 'Your reservation request was created successfully',
            description: `${ownerProfile?.firstName} ${ownerProfile?.lastName} now has to review it.`,
          })
        }
      } else {
        toast({
          title: 'You already have a reservation',
          description: `You've already reserved this book from ${ownerProfile?.firstName} ${ownerProfile?.lastName}. Check reservations section.`,
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Could not create reservation',
        description: 'Try again. If the issue persists, please contact support.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex md:flex-row flex-col md:justify-between items-center md: mt-4">
      <p>
        Owned by {ownerProfile?.firstName} {ownerProfile?.lastName}
      </p>
      <div className='flex md:flex-row flex-col gap-2'>
      <div className={cn('grid gap-2')}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[300px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelection}
              numberOfMonths={2}
              disabled={(date) =>
                getDisabledDates().some((range) => date >= range.from && date <= range.to) ||
                date < new Date()
              }
            />
          </PopoverContent>
        </Popover>
      </div>
        <Button onClick={handleReservationCreation}>Reserve</Button>
      </div>
      {activeReservations.map((reservation) => (<p>{`${reservation.id} ${reservation.status}`}</p>))}
    </div>
  )
}
