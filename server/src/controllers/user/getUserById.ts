import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
import { userRepository } from '@server/repositories/userRepository'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from "@trpc/server";
import { userSchema } from "@server/entities/user";

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(userSchema.pick({id: true}))
  .query(async ({ input: { id }, ctx: { repos } }) => {

    const user = await repos.userRepository.findByUserId(id)

    if (!user) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'We could not find an account with this email address',
          })
        }

    return user
  })
