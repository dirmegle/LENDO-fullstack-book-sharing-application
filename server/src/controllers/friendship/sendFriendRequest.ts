import { friendshipSchema } from '@server/entities/friendship'
import { friendshipRepository } from '@server/repositories/friendshipRepository'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { friendshipRequestMessage } from '@server/services/notification/notificationMessages'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'

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

    const authorizedUserProfile = await repos.userRepository.findByUserId(
      authUser.id
    )

    if (!authorizedUserProfile) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Could not find authorized user profile',
      })
    }

    const newFriendship = await repos.friendshipRepository.create({
      fromUserId: authUser.id,
      toUserId,
      id: uuidv4(),
      status: 'pending',
    })

    const newNotification = await repos.notificationsRepository.create({
      entityId: newFriendship.id,
      entityType: 'friendship',
      id: uuidv4(),
      isRead: false,
      message: friendshipRequestMessage(
        `${authorizedUserProfile.firstName} ${authorizedUserProfile.lastName}`
      ),
      triggeredById: authUser.id,
      userId: toUserId,
    })

    return {
      friendshipId: newFriendship.id,
      notificationId: newNotification.id,
    }
  })
