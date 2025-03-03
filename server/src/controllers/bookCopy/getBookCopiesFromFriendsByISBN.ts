import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { bookCopySchema } from '@server/entities/bookCopy'
import { bookCopyRepository } from '../../repositories/bookCopyRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookCopyRepository }))
  .input(bookCopySchema.pick({isbn: true}))
  .query(async ({ input: { isbn }, ctx: { authUser, repos } }) => {
    const bookCopies = await repos.bookCopyRepository.getBookCopiesByFriendsAndISBN(authUser.id, isbn)

    return bookCopies
  })