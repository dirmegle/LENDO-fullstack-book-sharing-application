import { notificationSchema } from '@server/entities/notification'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ notificationsRepository }))
  .input(notificationSchema.pick({id: true}))
  .mutation(async ({ input: {id}, ctx: { repos } }) => {
    const updatedNotification =
      await repos.notificationsRepository.updateNotificationAsRead(id)

    return updatedNotification
  })