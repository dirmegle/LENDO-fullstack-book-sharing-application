import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll, selectAll } from '@tests/utils/records'
import {
  fakeBook,
  fakeBookCopyWithId,
  fakeReservationWithId,
  fakeReservationWithoutId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { authContext, requestContext } from '@tests/utils/context'
import reservationRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(reservationRouter)

const [ownerUser, reserverUser, anotherReserverUser] = [
  fakeUserWithId(),
  fakeUserWithId(),
  fakeUserWithId(),
]
const book = fakeBook()
const bookCopy = fakeBookCopyWithId({
  isbn: book.isbn,
  ownerId: ownerUser.id,
  isLendable: true,
})

const correctInput = fakeReservationWithoutId({
  bookCopyId: bookCopy.id,
  reserverId: reserverUser.id,
})

beforeAll(async () => {
  await insertAll(db, 'user', [ownerUser, reserverUser])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'bookCopy', [bookCopy])
})

describe('createReservation', () => {
  it('throws an error if user is unauthenticated', async () => {
    const { createReservation } = createCaller(requestContext({ db }))
    await expect(createReservation(correctInput)).rejects.toThrow(
      /unauthenticated/i
    )
  })
  it('creates reservation and notification if input is correct', async () => {
    const { createReservation } = createCaller(
      authContext({ db }, reserverUser)
    )
    await createReservation(correctInput)
    const [createdReservation] = await selectAll(db, 'reservation', (q) =>
      q('reservation.bookCopyId', '=', reserverUser.id)
    )
    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', reserverUser.id)
    )

    expect(createdReservation.status).toEqual('pending')
    expect(createdReservation.bookCopyId).toEqual(bookCopy.id)
    expect(createdNotification.triggeredById).toEqual(reserverUser.id)
  })
  it('throws an error if the reservation dates overlaps with existing reservation dates for book copy', async () => {
    const previousReservation = fakeReservationWithId({
      reserverId: anotherReserverUser.id,
      bookCopyId: bookCopy.id,
      startDate: new Date('2024-11-07').toISOString(),
      endDate: new Date('2024-12-15').toISOString(),
    })
    await insertAll(db, 'reservation', [previousReservation])

    const { createReservation } = createCaller(
      authContext({ db }, reserverUser)
    )

    await expect(createReservation(correctInput)).rejects.toThrow()
  })
})
