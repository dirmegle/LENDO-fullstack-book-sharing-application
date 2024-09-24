import config from '@server/config'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { hash } from 'bcrypt'
import { userRepository } from '@server/repositories/userRepository'
import { v4 as uuidv4 } from 'uuid'
import { assertError } from '@server/utils/errors'
import { TRPCError } from '@trpc/server'
import { userSchema } from '../../entities/user'

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    userSchema.pick({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
    })
  )
  .mutation(async ({ input: user, ctx: { repos } }) => {
    const passwordHash = await hash(user.password, config.auth.passwordCost)

    const id = uuidv4()

    const createdUser = await repos.userRepository
      .create({
        ...user,
        password: passwordHash,
        id,
      })
      .catch((error: unknown) => {
        assertError(error)

        if (error.message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
            cause: error,
          })
        }

        throw error
      })
    return {
      id: createdUser.id,
    }
  })
