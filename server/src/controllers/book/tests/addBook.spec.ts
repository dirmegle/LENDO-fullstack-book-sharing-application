import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { fakeBook, fakeUserWithId } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import { bookKeys } from '@server/entities/book'
import {
  testMissingFields,
  testUndefinedFields,
} from '@tests/utils/undefinedMissingFields'
import bookRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(bookRouter)

describe('addBook', () => {
  it('throws error if user is unauthenticated', async () => {
    const { addBook } = createCaller(requestContext({ db }))
    const book = fakeBook()
    await expect(addBook(book)).rejects.toThrow(/unauthenticated/i)
  })
  it('saves book in database', async () => {
    const [user] = await insertAll(db, 'user', fakeUserWithId())
    const { addBook } = createCaller(authContext({ db }, user))
    const book = fakeBook()
    const response = await addBook(book)
    expect(response).toEqual(book)
  })
  it('throws error for duplicate book ISBN', async () => {
    const [user] = await insertAll(db, 'user', fakeUserWithId())
    const { addBook } = createCaller(authContext({ db }, user))
    const [existingBook] = await insertAll(db, 'book', [fakeBook()])

    await expect(
      addBook(fakeBook({ isbn: existingBook.isbn }))
    ).rejects.toThrow(/ISBN/i)
  })
  it('throws an error if any of the fields are undefined', async () => {
    const [user] = await insertAll(db, 'user', fakeUserWithId())
    const { addBook } = createCaller(authContext({ db }, user))

    testUndefinedFields(bookKeys, [], fakeBook, addBook)
  })
  it('throws an error if any of the fields are missing', async () => {
    const [user] = await insertAll(db, 'user', fakeUserWithId())
    const { addBook } = createCaller(authContext({ db }, user))

    testMissingFields(bookKeys, [], fakeBook, addBook)
  })
})
