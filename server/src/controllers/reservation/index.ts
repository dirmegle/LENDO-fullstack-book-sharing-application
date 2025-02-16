import { router } from '@server/trpc'
import createReservation from './createReservation'
import updateReservationStatus from './updateReservationStatus'
import getActiveReservationsByBookCopy from './getActiveReservationsByBookCopy'
import getReservationsByUser from './getReservationsByUser'

export default router({
  createReservation,
  updateReservationStatus,
  getActiveReservationsByBookCopy,
  getReservationsByUser,
})
