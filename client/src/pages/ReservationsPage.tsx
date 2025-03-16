import NoResultsMessage from '@/components/NoResultsMessage'
import ReservationRow from '@/components/ReservationRow'
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs'
import { useToast } from '@/hooks/useToast'
import { trpc } from '@/trpc'
import { ReservationWithISOString } from '@server/entities/reservation'
import { useEffect, useState } from 'react'
import illustrationReservations from '@/assets/images/illustrationReservations.png'

export default function Reservations() {
  const [activeTab, setActiveTab] = useState('owner')
  const [ownerReservations, setOwnerReservations] = useState<ReservationWithISOString[]>([])
  const [reserverReservations, setReserverReservations] = useState<ReservationWithISOString[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const getReservations = async () => {
      try {
        const fetchedOwnerReservations = await trpc.reservation.getReservationsByUser.query({
          role: 'owner',
        })
        setOwnerReservations(fetchedOwnerReservations)
        const fetchedReserverReservations = await trpc.reservation.getReservationsByUser.query({
          role: 'reserver',
        })
        setReserverReservations(fetchedReserverReservations)
      } catch {
        toast({
          title: 'Oops! Something went wrong',
          description:
            'Could not get your reservations. If the issue persists, please contact support.',
        })
      }
    }

    getReservations()
  }, [toast])

  const filterOnlyPending = (reservations: ReservationWithISOString[]) => {
    return reservations.filter((reservation) => reservation.status === 'pending')
  }

  const filterOutPending = (reservations: ReservationWithISOString[]) => {
    return reservations.filter((reservation) => reservation.status !== 'pending')
  }

  return (
    <div>
      <div className="flex md:flex-row flex-col md:justify-between">
        <h1 className="font-medium text-3xl mb-4">Reservations</h1>
        <Tabs value={activeTab} onValueChange={(newValue) => setActiveTab(newValue)}>
          <TabsList className="grid w-full grid-cols-2" variant="peach">
            <TabsTrigger value="owner">For my books</TabsTrigger>
            <TabsTrigger value="reserver">For books I've reserved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mb-4">
        <div>
          {activeTab === 'owner'
            ? filterOnlyPending(ownerReservations).length > 0 && (
                <>
                  <h2 className="font-medium my-2">Check these out</h2>
                  <div className="flex flex-col gap-2">
                    {filterOnlyPending(ownerReservations).map((reservation) => (
                      <ReservationRow
                        key={reservation.id}
                        reservation={reservation}
                        bookDetails={true}
                        asLink={true}
                      />
                    ))}
                  </div>
                </>
              )
            : filterOnlyPending(reserverReservations).length > 0 && (
                <>
                  <h2 className="font-medium my-2">Still waiting for a response on these</h2>
                  <div className="flex flex-col gap-2">
                    {filterOnlyPending(reserverReservations).map((reservation) => (
                      <ReservationRow
                        key={reservation.id}
                        reservation={reservation}
                        bookDetails={true}
                        asLink={true}
                      />
                    ))}
                  </div>
                </>
              )}
        </div>
      </div>
      <div>
        <h2 className="font-medium mb-2">All reservations</h2>
        <div className="flex flex-col gap-2">
          {activeTab === 'owner' ? (
            <>
              {filterOutPending(ownerReservations).length > 0 ? (
                filterOutPending(ownerReservations).map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    bookDetails={true}
                    asLink={true}
                  />
                ))
              ) : (
                <div className='mt-4'>
                  <NoResultsMessage
                    message="No reservations yet"
                    illustrationLink={illustrationReservations}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {filterOutPending(reserverReservations).length > 0 ? (
                filterOutPending(reserverReservations).map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    bookDetails={true}
                    asLink={true}
                  />
                ))
              ) : (
                <div className='mt-4'>
                  <NoResultsMessage
                    message="No reservations yet"
                    illustrationLink={illustrationReservations}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
