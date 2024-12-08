import { commentSchema } from '@server/entities/comment'
import { commentRepository } from '@server/repositories/commentRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .use(provideRepos({ commentRepository }))
  .input(commentSchema.pick({ id: true, content: true }))
  .mutation(async ({ input: { id, content }, ctx: { authUser, repos } }) => {
    const comment = await repos.commentRepository.getById(id)

    if (!comment) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find comment to update',
      })
    } else if (comment.userId !== authUser.id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User cannot update comment they are not author of',
      })
    }

    const updatedComment = await repos.commentRepository.updateContent(
      comment.id,
      comment.userId,
      content
    )

    return updatedComment
  })
