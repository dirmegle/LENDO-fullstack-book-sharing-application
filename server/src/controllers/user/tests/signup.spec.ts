import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { fakeUser } from '@server/entities/tests/fakes'
import { selectAll } from '@tests/utils/records'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const { signup } = createCaller({ db })

describe('signup', () => {
  it('saves user', async () => {
    const user = fakeUser()
    const response = await signup(user)

    const [createdUser] = await selectAll(db, 'user', (q) =>
      q('email', '=', user.email)
    )

    expect(createdUser).toMatchObject({
      ...user,
      password: expect.not.stringContaining(user.password),
    })

    expect(response).toEqual({
      id: createdUser.id,
    })
  })

  it('throws an error if email is invalid and does not save user', async () => {
    const user = fakeUser({ email: 'not-correct-email' })

    await expect(signup(user)).rejects.toThrow(/email/i)

    const [createdUser] = await selectAll(db, 'user', (q) =>
      q('email', '=', user.email)
    )

    expect(createdUser).toBeUndefined()
  })

  it('throws error if password is less than 8 characters', async () => {
    const user = fakeUser({ password: 'just4' })

    await expect(signup(user)).rejects.toThrow(/too_small/i)

    const [createdUser] = await selectAll(db, 'user', (q) =>
      q('email', '=', user.email)
    )
    expect(createdUser).toBeUndefined()
  })
})
