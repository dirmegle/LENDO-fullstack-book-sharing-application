import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { authContext, requestContext } from '@tests/utils/context'
import {
  fakeBook,
  fakeBookCopyWithId,
  fakeBookCopyWithoutId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { bookCopyKeys } from '@server/entities/bookCopy'
import {
  testMissingFields,
  testUndefinedFields,
} from '@tests/utils/undefinedMissingFields'
import bookCopyRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(bookCopyRouter)
const [book] = await insertAll(db, 'book', fakeBook())
const [user] = await insertAll(db, 'user', fakeUserWithId())

describe('addBookCopy', () => {
  it('throws an error if user is not authorized', async () => {
    const { addBookCopy } = createCaller(requestContext({ db }))
    const bookCopy = fakeBookCopyWithoutId({
      isbn: book.isbn,
      ownerId: user.id,
    })
    await expect(addBookCopy(bookCopy)).rejects.toThrow(/unauthenticated/i)
  })
  it('adds book copy if it does not already exist in the database', async () => {
    const { addBookCopy } = createCaller(authContext({ db }, user))
    const bookCopy = fakeBookCopyWithoutId({
      isbn: book.isbn,
      ownerId: user.id,
    })

    const response = await addBookCopy(bookCopy)

    expect(response).toEqual(
      fakeBookCopyWithId({ ...bookCopy, id: response.id })
    )
  })
  it('throws an error if the book copy already exists based on ISBN', async () => {
    const { addBookCopy } = createCaller(authContext({ db }, user))

    const [existingBookCopy] = await insertAll(db, 'bookCopy', [
      fakeBookCopyWithId({
        isbn: book.isbn,
        ownerId: user.id,
      }),
    ])

    const newBookCopy = fakeBookCopyWithoutId({ isbn: existingBookCopy.isbn })

    await expect(addBookCopy(newBookCopy)).rejects.toThrow(/ISBN/i)
  })

  it('throws an error if any of the fields are undefined', async () => {
    const { addBookCopy } = createCaller(authContext({ db }, user))

    testUndefinedFields(
      bookCopyKeys,
      ['id', 'ownerId'],
      fakeBookCopyWithoutId,
      addBookCopy
    )
  })

  it('throws an error if any of the fields are missing', async () => {
    const { addBookCopy } = createCaller(authContext({ db }, user))
    testMissingFields(
      bookCopyKeys,
      ['id', 'ownerId'],
      fakeBookCopyWithoutId,
      addBookCopy
    )
  })
})
