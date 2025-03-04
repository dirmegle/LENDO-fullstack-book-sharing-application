import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { userSchema } from '@server/entities/user'
import { friendshipRepository } from '@server/repositories/friendshipRepository'

export default authenticatedProcedure
  .use(provideRepos({ friendshipRepository }))
  .input(userSchema.pick({id: true}))
  .query(async ({ input: { id }, ctx: { authUser, repos } }) => {
    const friendship = await repos.friendshipRepository.getExistingFriendship(id, authUser.id)

    if (!friendship) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'The friendship between these two users does not exist',
          })
        }

    return friendship
  })