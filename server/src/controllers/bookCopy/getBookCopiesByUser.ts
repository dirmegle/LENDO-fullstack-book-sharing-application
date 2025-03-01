import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { bookCopyRepository } from '../../repositories/bookCopyRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookCopyRepository }))
  .query(async ({ ctx: { authUser, repos } }) => {
    const bookCopies = await repos.bookCopyRepository.getByOwnerId(authUser.id)

    return bookCopies
  })