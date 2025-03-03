import { bookSchema } from '@server/entities/book'
import { reservationsRepository } from '@server/repositories/reservationsRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(
    provideRepos({
      reservationsRepository,
    })
  )
  .input(bookSchema.pick({ isbn: true }))
  .query(async ({ input: { isbn }, ctx: { repos, authUser } }) => {
    const reservations =
      await repos.reservationsRepository.getReservationsByReserverIdAndISBN(authUser.id, isbn)

    return reservations
  })
