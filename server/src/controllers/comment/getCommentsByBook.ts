import { commentSchema } from '@server/entities/comment'
import { commentRepository } from '@server/repositories/commentRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ commentRepository }))
  .input(commentSchema.pick({ isbn: true }))
  .query(async ({ input: { isbn }, ctx: { authUser, repos } }) => {
    const comments = await repos.commentRepository.getByBook(isbn, authUser.id)
    return comments
  })
