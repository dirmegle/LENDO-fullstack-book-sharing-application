import { commentSchema } from '@server/entities/comment'
import { bookRepository } from '@server/repositories/bookRepository'
import { commentRepository } from '@server/repositories/commentRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'

export default authenticatedProcedure
  .use(provideRepos({ commentRepository, bookRepository }))
  .input(
    commentSchema.omit({
      id: true,
      userId: true,
    })
  )
  .mutation(async ({ input: comment, ctx: { authUser, repos } }) => {
    const book = await repos.bookRepository.findByISBN(comment.isbn)

    if (!book) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find book',
      })
    }

    const createdComment = repos.commentRepository.create({
      ...comment,
      id: uuidv4(),
      userId: authUser.id,
    })

    return createdComment
  })
