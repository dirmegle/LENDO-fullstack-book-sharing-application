import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
import { userRepository } from '@server/repositories/userRepository'
import provideRepos from '@server/trpc/provideRepos'
import { z } from "zod";

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(z.object({name: z.string()}))
  .query(async ({ input: { name }, ctx: { repos, authUser } }) => {

    const users = await repos.userRepository.searchUserByName(name)

    const filteredUsers = users.filter((user) => user.id !== authUser.id)

    return filteredUsers
  })