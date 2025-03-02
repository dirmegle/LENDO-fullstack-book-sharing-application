import { authenticatedProcedure } from "@server/trpc/authenticatedProcedure";
import { userRepository } from '@server/repositories/userRepository'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from "@trpc/server";
import { bookCopySchema } from "@server/entities/bookCopy";
import { printer } from "prettier/doc";

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(bookCopySchema.pick({id: true}))
  .query(async ({ input: { id }, ctx: { repos } }) => {

    const user = await repos.userRepository.findByBookCopyId(id)

    if (!user) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'We could not find an account for this book copy id',
          })
        }

    return user
  })
