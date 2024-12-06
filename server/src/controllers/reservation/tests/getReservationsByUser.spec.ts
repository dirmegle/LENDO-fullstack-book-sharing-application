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

const [user1, user2] = [fakeUserWithId(), fakeUserWithId()]
const book = fakeBook()

const bookCopy1 = fakeBookCopyWithId({
  isbn: book.isbn,
  ownerId: user1.id,
  isLendable: true,
})

const bookCopy2 = fakeBookCopyWithId({
  isbn: book.isbn,
  ownerId: user2.id,
  isLendable: true,
})

const reservation1 = fakeReservationWithId({
  reserverId: user2.id,
  bookCopyId: bookCopy1.id,
})

const reservation2 = fakeReservationWithId({
  reserverId: user1.id,
  bookCopyId: bookCopy1.id,
})

beforeAll(async () => {
  await insertAll(db, 'user', [user1, user2])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'bookCopy', [bookCopy1, bookCopy2])
})

describe('getReservationsByUser', () => {
  it('throws an error if user is unauthenticated', async () => {
    await insertAll(db, 'reservation', [reservation1, reservation2])
    const { getReservationsByUser } = createCaller(requestContext({ db }))

    await expect(getReservationsByUser({ role: 'reserver' })).rejects.toThrow(
      /unauthenticated/i
    )
  })

  it('gets an array of reservations by role owner', async () => {
    await insertAll(db, 'reservation', [reservation1, reservation2])

    const { getReservationsByUser } = createCaller(authContext({ db }, user1))

    const [result] = await getReservationsByUser({ role: 'owner' })

    expect(result).toEqual(reservation1)
  })

  it('gets an array of reservations by role reserver', async () => {
    await insertAll(db, 'reservation', [reservation1, reservation2])

    const { getReservationsByUser } = createCaller(authContext({ db }, user1))

    const [result] = await getReservationsByUser({ role: 'reserver' })

    expect(result).toEqual(reservation2)
  })

  it('returns an empty array if there are no reservations owner book copies', async () => {
    const { getReservationsByUser } = createCaller(authContext({ db }, user1))

    const result = await getReservationsByUser({ role: 'owner' })

    expect(result).toEqual([])
  })
})
