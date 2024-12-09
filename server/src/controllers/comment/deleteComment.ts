import { commentSchema } from '@server/entities/comment'
import { commentRepository } from '@server/repositories/commentRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ commentRepository }))
  .input(commentSchema.pick({ id: true }))
  .mutation(async ({ input: { id }, ctx: { authUser, repos } }) => {
    const commentToDelete = await repos.commentRepository.getById(id)

    if (!commentToDelete) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find comment',
      })
    } else if (commentToDelete.userId !== authUser.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Authorized user is not author of the comment',
      })
    }

    const deletedComment = await repos.commentRepository.delete(id, authUser.id)

    return deletedComment
  })
