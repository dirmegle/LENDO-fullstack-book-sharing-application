import { friendshipSchema } from '@server/entities/friendship'
import { friendshipRepository } from '@server/repositories/friendshipRepository'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import createNotification from '@server/services/notification/createNotification'

export default authenticatedProcedure
  .use(
    provideRepos({
      friendshipRepository,
      notificationsRepository,
      userRepository,
    })
  )
  .input(friendshipSchema.pick({ id: true, status: true }))
  .mutation(async ({ input: { id, status }, ctx: { authUser, repos } }) => {
    const friendship = await repos.friendshipRepository.findById(id)

    if (!friendship) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Friendship was not found',
      })
    }

    const updatedFriendship = await repos.friendshipRepository.updateStatus(
      id,
      status
    )

    if (!updatedFriendship) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find authorized user profile',
      })
    }

    const authorizedUserProfile = await repos.userRepository.findByUserId(
      authUser.id
    )

    if (!authorizedUserProfile) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find authorized user profile',
      })
    }

    try {
      await createNotification(
        'friendship',
        id,
        status,
        updatedFriendship.toUserId,
        authUser.id,
        repos
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to create notification for friendship update:',
        error
      )
    }
  })

// Update friendship status
// Create notification
