import bcrypt from 'bcrypt'
import { userSchema } from '@server/entities/user'
import { userRepository } from '@server/repositories/userRepository'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'
import { TRPCError } from '@trpc/server'
import jsonwebtoken from 'jsonwebtoken'
import config from '@server/config'

const { expiresIn, accessTokenKey } = config.auth

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
    })
  )
  .mutation(async ({ input: { email, password }, ctx: { repos } }) => {
    const user = await repos.userRepository.findByEmail(email)

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'We could not find an account with this email address',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password. Please try again.',
      })
    }

    const payload = prepareTokenPayload(user)

    const accessToken = jsonwebtoken.sign(payload, accessTokenKey, {
      expiresIn,
    })

    return {
      accessToken,
    }
  })
