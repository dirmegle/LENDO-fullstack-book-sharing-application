import {
  fakeUserWithId,
  fakeBook,
  fakeBookCopyWithId,
  fakeReservationWithId,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll, selectAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { authContext, requestContext } from '@tests/utils/context'
import messages from '@server/services/notification/notificationMessages'
import { random } from '@tests/utils/random'
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

const existingReservation = fakeReservationWithId({
  reserverId: reserverUser.id,
  bookCopyId: bookCopy.id,
})

beforeAll(async () => {
  await insertAll(db, 'user', [ownerUser, reserverUser, anotherReserverUser])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'bookCopy', [bookCopy])
  await insertAll(db, 'reservation', [existingReservation])
})

describe('updateReservationStatus', () => {
  it('throws an error if user is unauthenticated', async () => {
    const { updateReservationStatus } = createCaller(requestContext({ db }))

    await expect(
      updateReservationStatus({
        id: existingReservation.id,
        status: 'confirmed',
        bookCopyId: existingReservation.bookCopyId,
      })
    ).rejects.toThrow(/unauthenticated/i)
  })
  it('updates reservation status to confirmed if authUser is the owner and creates notification', async () => {
    const { updateReservationStatus } = createCaller(
      authContext({ db }, ownerUser)
    )

    await updateReservationStatus({
      id: existingReservation.id,
      status: 'confirmed',
      bookCopyId: existingReservation.bookCopyId,
    })

    const [updatedReservation] = await selectAll(db, 'reservation', (q) =>
      q('reservation.id', '=', existingReservation.id)
    )

    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', ownerUser.id)
    )

    expect(updatedReservation.status).toEqual('confirmed')
    expect(createdNotification.message).toEqual(
      messages.reservationConfirmedMessage(
        `${ownerUser.firstName} ${ownerUser.lastName}`,
        book.title
      )
    )
  })

  it('updates reservation status to cancelled if authUser is the reserver and creates notification', async () => {
    const { updateReservationStatus } = createCaller(
      authContext({ db }, reserverUser)
    )

    await updateReservationStatus({
      id: existingReservation.id,
      status: 'cancelled',
      bookCopyId: existingReservation.bookCopyId,
    })

    const [updatedReservation] = await selectAll(db, 'reservation', (q) =>
      q('reservation.id', '=', existingReservation.id)
    )

    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', reserverUser.id)
    )

    expect(updatedReservation.status).toEqual('cancelled')
    expect(createdNotification.message).toEqual(
      messages.reservationCancelledMessage(
        `${reserverUser.firstName} ${reserverUser.lastName}`,
        book.title
      )
    )
  })

  it('throws an error if authUser is the reserver and tries to update status to confirmed', async () => {
    const { updateReservationStatus } = createCaller(
      authContext({ db }, reserverUser)
    )

    await expect(
      updateReservationStatus({
        id: existingReservation.id,
        status: 'confirmed',
        bookCopyId: existingReservation.bookCopyId,
      })
    ).rejects.toThrow()
  })

  it('throws an error if reservation does not exist', async () => {
    const { updateReservationStatus } = createCaller(
      authContext({ db }, reserverUser)
    )

    await expect(
      updateReservationStatus({
        id: random.guid(),
        status: 'confirmed',
        bookCopyId: existingReservation.bookCopyId,
      })
    ).rejects.toThrow()
  })

  it('throws an error input status is pending', async () => {
    const { updateReservationStatus } = createCaller(
      authContext({ db }, reserverUser)
    )

    await expect(
      updateReservationStatus({
        id: existingReservation.id,
        status: 'pending',
        bookCopyId: existingReservation.bookCopyId,
      })
    ).rejects.toThrow()
  })
})
