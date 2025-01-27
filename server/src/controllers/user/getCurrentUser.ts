import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
import { userRepository } from '@server/repositories/userRepository'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from "@trpc/server";

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .query(async ({ctx: { authUser, repos }}) => {
    const user = await repos.userRepository.findByUserId(authUser.id)

    if (!user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'We could not find an account with this email address',
          })
        }

    return user
  })

  