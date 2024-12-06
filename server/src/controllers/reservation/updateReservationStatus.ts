import { reservationSchema } from '@server/entities/reservation'
import { bookCopyRepository } from '@server/repositories/bookCopyRepository'
import { bookRepository } from '@server/repositories/bookRepository'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { reservationsRepository } from '@server/repositories/reservationsRepository'
import { userRepository } from '@server/repositories/userRepository'
import createNotification from '@server/services/notification/createNotification'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(
    provideRepos({
      reservationsRepository,
      notificationsRepository,
      userRepository,
      bookCopyRepository,
      bookRepository,
    })
  )
  .input(reservationSchema.pick({ id: true, status: true, bookCopyId: true }))
  .mutation(
    async ({ input: { id, status, bookCopyId }, ctx: { authUser, repos } }) => {
      if (status === 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot update status to pending',
        })
      }

      const existingBookCopy =
        await repos.bookCopyRepository.getById(bookCopyId)

      if (!existingBookCopy) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Book copy for this reservation does not exist',
        })
      }

      const existingReservation =
        await repos.reservationsRepository.getReservationById(id)

      if (
        existingReservation.reserverId === authUser.id &&
        (status === 'confirmed' || status === 'rejected')
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Reserver cannot confirm of reject reservation',
        })
      }

      const updatedReservation =
        await repos.reservationsRepository.updateStatus(id, status)

      if (!updatedReservation) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Could not find existing reservation',
        })
      }

      try {
        if (existingReservation.reserverId === authUser.id) {
          await createNotification(
            'reservation',
            updatedReservation.id,
            updatedReservation.status,
            existingBookCopy.ownerId,
            authUser.id,
            repos,
            existingBookCopy.isbn
          )
        } else {
          await createNotification(
            'reservation',
            updatedReservation.id,
            updatedReservation.status,
            updatedReservation.reserverId,
            authUser.id,
            repos,
            existingBookCopy.isbn
          )
        }
      } catch {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'Could not create notification for the updated reservation status',
        })
      }

      return updatedReservation
    }
  )
