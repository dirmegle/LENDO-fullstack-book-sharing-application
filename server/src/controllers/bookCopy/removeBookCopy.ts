import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { bookCopySchema } from '@server/entities/bookCopy'
import { TRPCError } from '@trpc/server'
import { reservationsRepository } from '@server/repositories/reservationsRepository'
import { bookCopyRepository } from '../../repositories/bookCopyRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookCopyRepository, reservationsRepository }))
  .input(bookCopySchema.pick({ id: true}))
  .mutation(async ({ input: { id }, ctx: { repos } }) => {

    const existingBookCopy = await repos.bookCopyRepository.getById(id)

    if (!existingBookCopy) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot perform operation, book copy does not exist',
      })
    }

    const existingReservations = await repos.reservationsRepository.getActiveReservationsByBookCopyId(id)

    if (existingReservations.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot perform operation, book has active reservations',
        })
      }

    const removedBookCopy = await repos.bookCopyRepository.updateAvailability(id)

    return removedBookCopy
  })
