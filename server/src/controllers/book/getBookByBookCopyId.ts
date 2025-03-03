import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { bookCopySchema } from '@server/entities/bookCopy'
import { bookRepository } from '../../repositories/bookRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookRepository }))
  .input(bookCopySchema.pick({id: true}))
  .query(async ({ input: { id }, ctx: { repos } }) => {

    const book = await repos.bookRepository.getBookByBookCopyId(id.trim())

    if (!book) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not fetch book data',
      })
    }

    return book
  })
