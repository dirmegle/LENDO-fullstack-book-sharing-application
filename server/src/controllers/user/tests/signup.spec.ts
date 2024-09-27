import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { fakeUserWithId, fakeUserWithoutId } from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { userKeysAll } from '@server/entities/user'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(userRouter)
const { signup } = createCaller({ db })

describe('signup', () => {
  it('saves new user if input is correct', async () => {
    const user = fakeUserWithoutId()
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
    const user = fakeUserWithoutId({ email: 'not-correct-email' })

    await expect(signup(user)).rejects.toThrow(/email/i)

    const [createdUser] = await selectAll(db, 'user', (q) =>
      q('email', '=', user.email)
    )

    expect(createdUser).toBeUndefined()
  })

  it('throws error if password is less than 8 characters', async () => {
    const user = fakeUserWithoutId({ password: 'just4' })

    await expect(signup(user)).rejects.toThrow(/too_small/i)

    const [createdUser] = await selectAll(db, 'user', (q) =>
      q('email', '=', user.email)
    )
    expect(createdUser).toBeUndefined()
  })

  it('throws error if any of the required properties are empty', async () => {
    const userKeys = userKeysAll.filter((word) => word !== 'id')

    userKeys.forEach(async (key) => {
      const user = fakeUserWithoutId({ [key]: '' })

      await expect(signup(user)).rejects.toThrowError(new RegExp(key, 'i'))
    })
  })

  it('throws error for duplicate email', async () => {
    const [existingUser] = await insertAll(db, 'user', [fakeUserWithId()])

    const newUser = fakeUserWithoutId({ email: existingUser.email })

    await expect(signup(newUser)).rejects.toThrowError(/email/i)
  })

  it('stores email with trimmed whitespace', async () => {
    const user = fakeUserWithoutId()

    await signup({ ...user, email: `   ${user.email} ` })

    const [savedUser] = await selectAll(db, 'user', (q) =>
      q('email', '=', user.email)
    )

    expect(savedUser.email).toEqual(user.email)
  })
})
