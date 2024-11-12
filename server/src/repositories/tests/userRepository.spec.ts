import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeUserWithId } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { random } from '@tests/utils/random'
import { userRepository } from '../userRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = userRepository(db)

describe('create', () => {
  it('creates user in the database if inputs are correct', async () => {
    const user = fakeUserWithId()
    const createdUser = await repository.create(user)

    expect(createdUser).toEqual({
      id: expect.any(String),
      firstName: user.firstName,
      lastName: user.lastName,
    })
  })
  it('throws error for duplicating unique fields', async () => {
    const [existingUser] = await insertAll(db, 'user', [fakeUserWithId()])

    const newUser = {
      id: random.guid(),
      email: existingUser.email,
      firstName: 'First',
      lastName: 'Last',
      password: 'password123!',
    }

    await expect(repository.create(newUser)).rejects.toThrowError(/email/i)
  })
})

describe('findByEmail', () => {
  it('returns user by email if exists', async () => {
    const [user] = await insertAll(db, 'user', [fakeUserWithId()])
    const foundUser = await repository.findByEmail(user.email)
    expect(foundUser).toEqual(user)
  })
  it('returns undefined if the user does not exist', async () => {
    const foundUser = await repository.findByEmail(fakeUserWithId().email)
    expect(foundUser).toBeUndefined()
  })
})

describe('findById', () => {
  it('returns user by id if exists', async () => {
    const [user] = await insertAll(db, 'user', [fakeUserWithId()])
    const foundUser = await repository.findByUserId(user.id)
    expect(foundUser).toEqual(user)
  })
  it('returns undefined if the user does not exist', async () => {
    const foundUser = await repository.findByUserId(fakeUserWithId().id)
    expect(foundUser).toBeUndefined()
  })
})
