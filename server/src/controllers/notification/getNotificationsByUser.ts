import { notificationsRepository } from '@server/repositories/notificationsRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(provideRepos({ notificationsRepository }))
  .query(async ({ ctx: { authUser, repos } }) => {
    const notifications =
      await repos.notificationsRepository.getNotificationsByUser(authUser.id)

    return notifications
  })
