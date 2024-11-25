import { friendshipSchema } from '@server/entities/friendship'
import { friendshipRepository } from '@server/repositories/friendshipRepository'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'
import createNotification from '@server/services/notification/createNotification'

export default authenticatedProcedure
  .use(
    provideRepos({
      friendshipRepository,
      notificationsRepository,
      userRepository,
    })
  )
  .input(friendshipSchema.pick({ toUserId: true }))
  .mutation(async ({ input: { toUserId }, ctx: { authUser, repos } }) => {
    try {
      const existingFriendship =
        await repos.friendshipRepository.getExistingFriendship(
          toUserId,
          authUser.id
        )

      if (existingFriendship) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Friendship between these two users already exists',
        })
      }

      const newFriendship = await repos.friendshipRepository.create({
        fromUserId: authUser.id,
        toUserId,
        id: uuidv4(),
        status: 'pending',
      })

      await createNotification(
        'friendship',
        newFriendship.id,
        newFriendship.status,
        newFriendship.toUserId,
        newFriendship.fromUserId,
        repos
      )
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Could not create notification about the new friendship request',
      })
    }
  })
