import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeUser } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { userRepository } from '../userRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)

describe('create', () => {
  it('creates user in the database if inputs are correct', async () => {
    const user = fakeUser()
    const createdUser = await repository.create(user)

    expect(createdUser).toEqual({
      id: expect.any(String),
      firstName: user.firstName,
      lastName: user.lastName,
    })
  })
})

describe('findByEmail', () => {
  it('returns user by email if exists', async () => {
    const [user] = await insertAll(db, 'user', [fakeUser()])
    const foundUser = await repository.findByEmail(user.email)
    expect(foundUser).toEqual(user)
  })
  it('returns undefined if the user does not exist', async () => {
    const foundUser = await repository.findByEmail(fakeUser().email)
    expect(foundUser).toBeUndefined()
  })
})
