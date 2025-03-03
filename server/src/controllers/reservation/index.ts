import { router } from '@server/trpc'
import createReservation from './createReservation'
import updateReservationStatus from './updateReservationStatus'
import getActiveReservationsByBookCopy from './getActiveReservationsByBookCopy'
import getReservationsByUser from './getReservationsByUser'
import getReservationsByReserverAndISBN from './getReservationsByReserverAndISBN'

export default router({
  createReservation,
  updateReservationStatus,
  getActiveReservationsByBookCopy,
  getReservationsByUser,
  getReservationsByReserverAndISBN
})
