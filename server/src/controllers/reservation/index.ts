import { router } from '@server/trpc'
import createReservation from './createReservation'
import updateReservationStatus from './updateReservationStatus'
import getReservationsByBookCopy from './getReservationsByBookCopy'
import getReservationsByUser from './getReservationsByUser'

export default router({
  createReservation,
  updateReservationStatus,
  getReservationsByBookCopy,
  getReservationsByUser,
})
