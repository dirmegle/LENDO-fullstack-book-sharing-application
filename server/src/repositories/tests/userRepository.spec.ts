import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeBook, fakeBookCopyWithId, fakeFriendshipWithId, fakeUserWithId } from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
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

describe('findByBookCopyId', () => {
  it('returns user by book copy id if exists', async () => {
    const [user] = await insertAll(db, 'user', [fakeUserWithId()])
    const [book] = await insertAll(db, 'book', [fakeBook()])
    const [bookCopy] = await insertAll(db, 'bookCopy', [fakeBookCopyWithId({ownerId: user.id, isbn: book.isbn})])

    const foundUser = await repository.findByBookCopyId(bookCopy.id)
    expect(foundUser).toEqual(user)
  })
})

describe('getUserFriendsByUser', () => {
  it('returns an array of user friends', async () => {
    const [user, friendUser] = await insertAll(db, 'user', [fakeUserWithId(), fakeUserWithId()])
    await insertAll(db, 'friendship', [fakeFriendshipWithId({fromUserId: user.id, toUserId: friendUser.id, status: 'accepted'})])

    const [ friend ] = await repository.getUserFriendsByUser(user.id)

    expect(friend.userId).toEqual(friendUser.id)
  })

  it('returns an empty array if user has no friends', async () => {
    const [user] = await insertAll(db, 'user', [fakeUserWithId()])
    const friends = await repository.getUserFriendsByUser(user.id)
    expect(friends).toEqual([])
  })
})

describe('searchUserByName', () => {
  it('returns user by partial full name', async () => {
    const [user] = await insertAll(db, 'user', [fakeUserWithId()])
    const  [ foundUser ] = await repository.searchUserByName(user.firstName)
    expect(foundUser).toEqual(user)
  })
})

describe('updateEmail', () => {
  it('updates user email', async () => {
    const [user] = await insertAll(db, 'user', [fakeUserWithId()])
    await repository.updateEmail('newemail@domain.com', user.id)

    const [updatedUser] = await selectAll(db, 'user', (q) =>
          q('id', '=', user.id)
        )
    expect(updatedUser.email).toEqual('newemail@domain.com')
  })
})


