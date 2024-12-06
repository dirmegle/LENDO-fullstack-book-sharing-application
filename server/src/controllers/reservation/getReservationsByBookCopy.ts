import { reservationSchema } from '@server/entities/reservation'
import { reservationsRepository } from '@server/repositories/reservationsRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(
    provideRepos({
      reservationsRepository,
    })
  )
  .input(reservationSchema.pick({ bookCopyId: true }))
  .mutation(async ({ input: { bookCopyId }, ctx: { repos } }) => {
    const reservations =
      await repos.reservationsRepository.getReservationsByBookCopyId(bookCopyId)

    return reservations
  })
