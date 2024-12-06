import {
  fakeUserWithId,
  fakeBook,
  fakeBookCopyWithId,
  fakeReservationWithId,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { authContext, requestContext } from '@tests/utils/context'
import reservationRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(reservationRouter)

const [ownerUser, reserverUser] = [fakeUserWithId(), fakeUserWithId()]
const book = fakeBook()
const bookCopy = fakeBookCopyWithId({
  isbn: book.isbn,
  ownerId: ownerUser.id,
  isLendable: true,
})

const existingReservation = fakeReservationWithId({
  reserverId: reserverUser.id,
  bookCopyId: bookCopy.id,
})

beforeAll(async () => {
  await insertAll(db, 'user', [ownerUser, reserverUser])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'bookCopy', [bookCopy])
})

describe('getReservationsByBookCopy', () => {
  it('throws an error if user is unauthenticated', async () => {
    await insertAll(db, 'reservation', [existingReservation])
    const { getReservationsByBookCopy } = createCaller(requestContext({ db }))

    await expect(
      getReservationsByBookCopy({ bookCopyId: bookCopy.id })
    ).rejects.toThrow(/unauthenticated/i)
  })

  it('gets an array of reservations if they exist', async () => {
    await insertAll(db, 'reservation', [existingReservation])

    const { getReservationsByBookCopy } = createCaller(
      authContext({ db }, ownerUser)
    )

    const [result] = await getReservationsByBookCopy({
      bookCopyId: bookCopy.id,
    })

    expect(result).toEqual(existingReservation)
  })

  it('returns an empty array if there are no reservations for book copy', async () => {
    const { getReservationsByBookCopy } = createCaller(
      authContext({ db }, ownerUser)
    )

    const result = await getReservationsByBookCopy({
      bookCopyId: bookCopy.id,
    })

    expect(result).toEqual([])
  })
})
