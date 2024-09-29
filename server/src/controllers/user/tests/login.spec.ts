import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { fakeUserWithId } from '@server/entities/tests/fakes'
import userRouter from '..'

const createCaller = createCallerFactory(userRouter)
const db = await wrapInRollbacks(createTestDatabase())
const CORRECT_PASSWORD = 'password.123'

const [userSeed] = await insertAll(db, 'user', [
  fakeUserWithId({
    email: 'existing@user.com',
    password: '$2b$10$sD53fzWIQBjXWfSDzuwmMOyY1ZAygLpRZlLxxPhcNG5r9BFWrNaDC',
  }),
])

const { login } = createCaller({ db } as any)

describe('login', () => {
  it('returns a token if email and password match', async () => {
    const { accessToken } = await login({
      email: userSeed.email,
      password: CORRECT_PASSWORD,
    })

    expect(accessToken).toEqual(expect.any(String))
    expect(accessToken.slice(0, 3)).toEqual('eyJ')
  })
  it('throws an error if email does not exist', async () => {
    await expect(
      login({
        email: 'nonexisting@user.com',
        password: CORRECT_PASSWORD,
      })
    ).rejects.toThrow()
  })
  it('throws an error if password does not match', async () => {
    await expect(
      login({
        email: userSeed.email,
        password: 'incorrectPassword123',
      })
    ).rejects.toThrow()
  })
  it('throws error if email is invalid', async () => {
    await expect(
      login({
        email: 'not-an-email',
        password: CORRECT_PASSWORD,
      })
    ).rejects.toThrow(/email/)
  })
  it('allows login with different-cased letters in email', async () => {
    await expect(
      login({
        email: userSeed.email.toUpperCase(),
        password: CORRECT_PASSWORD,
      })
    ).resolves.toEqual(expect.anything())
  })
  it('allows login with surrounding whitespace', async () => {
    await expect(
      login({
        email: ` \t ${userSeed.email}\t `,
        password: CORRECT_PASSWORD,
      })
    ).resolves.toEqual(expect.anything())
  })
})
