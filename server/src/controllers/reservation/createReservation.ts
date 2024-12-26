import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { userRepository } from '@server/repositories/userRepository'
import { reservationsRepository } from '@server/repositories/reservationsRepository'
import { reservationSchema } from '@server/entities/reservation'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'
import createNotification from '@server/services/notification/createNotification'
import { bookRepository } from '@server/repositories/bookRepository'
import { bookCopyRepository } from '../../repositories/bookCopyRepository'
import areDatesAvailable from './utils/areDatesAvailable'

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
  .input(reservationSchema.omit({ id: true, reserverId: true }))
  .mutation(async ({ input: reservation, ctx: { authUser, repos } }) => {
    if (new Date(reservation.startDate) > new Date(reservation.endDate)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Start date cannot be later than end date',
      })
    }

    const existingBookCopy = await repos.bookCopyRepository.getById(
      reservation.bookCopyId
    )

    if (!existingBookCopy) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Book copy for this reservation does not exist',
      })
    }

    const existingReservations =
      await repos.reservationsRepository.getDatesByBookCopyId(
        reservation.bookCopyId
      )

    if (
      !areDatesAvailable(
        reservation.startDate,
        reservation.endDate,
        existingReservations
      )
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Requested reservation dates overlap with existing reservations',
      })
    }

    // TODO: relocate or duplicate this check to updateReservationStatus procedure

    const createdReservation = await repos.reservationsRepository.create({
      ...reservation,
      id: uuidv4(),
      reserverId: authUser.id,
    })

    try {
      await createNotification(
        'reservation',
        createdReservation.id,
        createdReservation.status,
        existingBookCopy.ownerId,
        createdReservation.reserverId,
        repos,
        existingBookCopy.isbn
      )
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Could not create notification for the new reservation request',
      })
    }

    return createdReservation
  })
