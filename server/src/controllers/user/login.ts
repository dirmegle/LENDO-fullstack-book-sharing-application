import bcrypt from 'bcrypt'
import { userRepository } from '@server/repositories/userRepository'
import { publicProcedure } from '@server/trpc'
import provideRepos from '@server/trpc/provideRepos'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'
import { TRPCError } from '@trpc/server'
import jsonwebtoken from 'jsonwebtoken'
import config from '@server/config'
import { z } from 'zod'
import calculateExpirationDate from './utils/calculateExpirationDate'

const { expiresIn, accessTokenKey } = config.auth

export default publicProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input( z.object({
    email: z.string().email(),
    password: z.string(),
  }))
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

    const expirationDate = calculateExpirationDate(expiresIn)

    return {
      accessToken, expirationDate, user
    }
  })
