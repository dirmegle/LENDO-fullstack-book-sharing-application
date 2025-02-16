import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { bookCopySchema } from '@server/entities/bookCopy'
import { TRPCError } from '@trpc/server'
import { bookCopyRepository } from '../../repositories/bookCopyRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookCopyRepository }))
  .input(bookCopySchema.pick({isbn: true}))
  .query(async ({ input: { isbn }, ctx: { authUser, repos } }) => {
    const bookCopy = await repos.bookCopyRepository.getByISBNAndOwnerId(isbn, authUser.id)

    if (!bookCopy) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Book copy with this ISBN for this user does not exist',
          })
        }

    return bookCopy.id
  })