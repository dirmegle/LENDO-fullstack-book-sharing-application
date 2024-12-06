import { router } from '@server/trpc'
import createReservation from './createReservation'
import updateReservationStatus from './updateReservationStatus'

export default router({ createReservation, updateReservationStatusByOwner: updateReservationStatus })

// updateReservationStatus - send notification based on status
// changeReservationDate - check if doesn't clash with other reservation
// getReservationsByBookCopy
// getReservationsByOwner
// getReservationsByReserver
// what to do if end_date is today? Both reserver and owner get notifications, in frontend it's displayed that it's passed due date - either change end_date or complete it.

// create
// getReservationsByBookCopyId
// getReservationsByOwnerId
// getReservationsByReserverId
// updateStatus
// updateDates
// Delete reservation