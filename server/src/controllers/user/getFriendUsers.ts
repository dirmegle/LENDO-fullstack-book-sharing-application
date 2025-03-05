import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
import { userRepository } from '@server/repositories/userRepository'
import provideRepos from '@server/trpc/provideRepos'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .query(async ({ ctx: { repos, authUser } }) => {

    const users = await repos.userRepository.getUserFriendsByUser(authUser.id)

    return users
  })
