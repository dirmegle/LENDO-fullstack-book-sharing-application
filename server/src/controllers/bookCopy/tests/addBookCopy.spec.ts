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
    const userKeys = bookCopyKeys.filter(
      (word) => word !== 'id' && word !== 'ownerId'
    )

    userKeys.forEach(async (key) => {
      const bookCopy = fakeBookCopyWithoutId({ [key]: undefined })

      await expect(addBookCopy(bookCopy)).rejects.toThrowError(
        new RegExp(key, 'i')
      )
    })
  })

  // it('throws an error if any of the required fields are missing', async () => {
  //   const { addBookCopy } = createCaller(authContext({ db }, user))
  //   const requiredKeys = bookCopyKeys.filter(
  //     (key) => key !== 'id' && key !== 'ownerId' // Adjust as needed for non-required fields
  //   )

  //   for (const key of requiredKeys) {
  //     const bookCopy = fakeBookCopyWithoutId({
  //       isbn: book.isbn,
  //       ownerId: user.id,
  //       // Include other default properties if needed
  //     })

  //     // Delete the key to simulate a missing property
  //     delete bookCopy[key]

  //     await expect(addBookCopy(bookCopy)).rejects.toThrowError(
  //       new RegExp(key, 'i')
  //     )
  //   }
  // })
})
