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
  it('throws an error of user is unauthenticated', async () => {
    const { updateReservationStatusByOwner } = createCaller(
      requestContext({ db })
    )

    await expect(
      updateReservationStatusByOwner({
        id: existingReservation.id,
        status: 'confirmed',
        bookCopyId: existingReservation.bookCopyId,
      })
    ).rejects.toThrow(/unauthenticated/i)
  })
  it('updates reservation status to confirmed if input is correct and creates notification', async () => {
    const { updateReservationStatusByOwner } = createCaller(
      authContext({ db }, reserverUser)
    )

    await updateReservationStatusByOwner({
      id: existingReservation.id,
      status: 'confirmed',
      bookCopyId: existingReservation.bookCopyId,
    })

    const [updatedReservation] = await selectAll(db, 'reservation', (q) =>
      q('reservation.id', '=', existingReservation.id)
    )

    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', reserverUser.id)
    )

    expect(updatedReservation.status).toEqual('confirmed')
    expect(createdNotification.message).toEqual(
      messages.reservationConfirmedMessage(
        `${reserverUser.firstName} ${reserverUser.lastName}`,
        book.title
      )
    )
  })
  it('updates reservation status to cancelled if input is correct and creates notification', async () => {
    const { updateReservationStatusByOwner } = createCaller(
      authContext({ db }, reserverUser)
    )

    await updateReservationStatusByOwner({
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
  it('updates reservation status to completed if input is correct and creates notification', async () => {
    const { updateReservationStatusByOwner } = createCaller(
      authContext({ db }, reserverUser)
    )

    await updateReservationStatusByOwner({
      id: existingReservation.id,
      status: 'completed',
      bookCopyId: existingReservation.bookCopyId,
    })

    const [updatedReservation] = await selectAll(db, 'reservation', (q) =>
      q('reservation.id', '=', existingReservation.id)
    )

    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', reserverUser.id)
    )

    expect(updatedReservation.status).toEqual('completed')
    expect(createdNotification.message).toEqual(
      messages.reservationCompletedMessage(
        `${reserverUser.firstName} ${reserverUser.lastName}`,
        book.title
      )
    )
  })
  it('updates reservation status to rejected if input is correct and creates notification', async () => {
    const { updateReservationStatusByOwner } = createCaller(
      authContext({ db }, reserverUser)
    )

    await updateReservationStatusByOwner({
      id: existingReservation.id,
      status: 'rejected',
      bookCopyId: existingReservation.bookCopyId,
    })

    const [updatedReservation] = await selectAll(db, 'reservation', (q) =>
      q('reservation.id', '=', existingReservation.id)
    )

    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', reserverUser.id)
    )

    expect(updatedReservation.status).toEqual('rejected')
    expect(createdNotification.message).toEqual(
      messages.reservationRejectedMessage(
        `${reserverUser.firstName} ${reserverUser.lastName}`,
        book.title
      )
    )
  })
  it('throws an error if reservation does not exist', async () => {
    const { updateReservationStatusByOwner } = createCaller(
      authContext({ db }, reserverUser)
    )

    await expect(
      updateReservationStatusByOwner({
        id: random.guid(),
        status: 'confirmed',
        bookCopyId: existingReservation.bookCopyId,
      })
    ).rejects.toThrow()
  })
})
