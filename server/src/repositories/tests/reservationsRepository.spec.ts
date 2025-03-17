import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeBook,
  fakeBookCopyWithId,
  fakeReservationWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes.js'
import { insertAll } from '@tests/utils/records.js'
import { random } from '@tests/utils/random.js'
import { reservationsRepository } from '../reservationsRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = reservationsRepository(db)

const reserverUser = fakeUserWithId()
const ownerUser = fakeUserWithId()
const book = fakeBook()
const bookCopy = fakeBookCopyWithId({
  isbn: book.isbn,
  ownerId: ownerUser.id,
  isLendable: true,
})

beforeAll(async () => {
  await insertAll(db, 'user', [reserverUser, ownerUser])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'bookCopy', [bookCopy])
})

describe('create', () => {
  it('creates reservation if input is correct', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })
    const result = await repository.create(reservation)
    expect(result).toEqual(reservation)
  })

  it('throws an error if end_date is smaller than start_date', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
      endDate: new Date('2024-12-15').toISOString(),
      startDate: new Date('2024-12-17').toISOString(),
    })

    await expect(repository.create(reservation)).rejects.toThrow()
  })
})

describe('getReservationsByBookCopyId', () => {
  it('returns reservation if it exists by the book copy id', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const [result] = await repository.getReservationsByBookCopyId(bookCopy.id)

    expect(result).toEqual(reservation)
  })
  it('returns an empty array if the reservation does not exist', async () => {
    const result = await repository.getReservationsByBookCopyId(random.guid())

    expect(result.length).toEqual(0)
  })
})

describe('getReservationsByOwnerId', () => {
  it('returns reservation if it exists by the book copy owner id', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const [result] = await repository.getReservationsByOwnerId(ownerUser.id)

    expect(result).toEqual(reservation)
  })
  it('returns an empty array if the reservation does not exist', async () => {
    const result = await repository.getReservationsByOwnerId(random.guid())

    expect(result.length).toEqual(0)
  })
})

describe('getReservationsByReserverId', () => {
  it('returns reservation if it exists by the book copy owner id', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const [result] = await repository.getReservationsByReserverId(
      reserverUser.id
    )

    expect(result).toEqual(reservation)
  })
  it('returns an empty array if the reservation does not exist', async () => {
    const result = await repository.getReservationsByReserverId(random.guid())

    expect(result.length).toEqual(0)
  })
})

describe('updateStatus', () => {
  it('updates reservation status as confirmed', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const result = await repository.updateStatus(reservation.id, 'confirmed')
    expect(result.status).toEqual('confirmed')
  })
  it('updates reservation status as rejected', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const result = await repository.updateStatus(reservation.id, 'rejected')
    expect(result.status).toEqual('rejected')
  })
  it('updates reservation status as cancelled', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const result = await repository.updateStatus(reservation.id, 'cancelled')
    expect(result.status).toEqual('cancelled')
  })
  it('updates reservation status as completed', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const result = await repository.updateStatus(reservation.id, 'cancelled')
    expect(result.status).toEqual('cancelled')
  })
  it('throws an error if reservation does not exist', async () => {})
})

describe('getDatesByBookCopyId', () => {
  it('returns an array of reservation dates by book copy', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
    })

    await insertAll(db, 'reservation', [reservation])

    const result = await repository.getDatesByBookCopyId(reservation.bookCopyId)
    expect(result).toEqual([
      { startDate: reservation.startDate, endDate: reservation.endDate },
    ])
  })
  it('returns an empty array if reservations by book copy do not exist', async () => {
    const result = await repository.getDatesByBookCopyId(random.guid())
    expect(result.length).toEqual(0)
  })
})

describe('updateDates', () => {
  it('updates only start_date, end_date remains the same', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
      startDate: new Date('2024-11-30').toISOString(),
      endDate: new Date('2024-12-15').toISOString(),
    })

    await insertAll(db, 'reservation', [reservation])

    const newStartDate = new Date('2024-12-01').toISOString()

    const result = await repository.updateDates(
      reservation.id,
      newStartDate,
      reservation.endDate
    )

    expect(result.startDate).toEqual(newStartDate)
    expect(result.endDate).toEqual(reservation.endDate)
  })
  it('updates only end_date, start_date remains the same', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
      startDate: new Date('2024-11-30').toISOString(),
      endDate: new Date('2024-12-15').toISOString(),
    })

    await insertAll(db, 'reservation', [reservation])

    const newEndDate = new Date('2024-12-17').toISOString()

    const result = await repository.updateDates(
      reservation.id,
      reservation.startDate,
      newEndDate
    )

    expect(result.startDate).toEqual(reservation.startDate)
    expect(result.endDate).toEqual(newEndDate)
  })
  it('throws an error if end_date is smaller than start_date', async () => {
    const reservation = fakeReservationWithId({
      bookCopyId: bookCopy.id,
      reserverId: reserverUser.id,
      startDate: new Date('2024-11-30').toISOString(),
      endDate: new Date('2024-12-15').toISOString(),
    })

    await insertAll(db, 'reservation', [reservation])

    const newStartDate = new Date('2024-12-16').toISOString()

    await expect(
      repository.updateDates(reservation.id, newStartDate, reservation.endDate)
    ).rejects.toThrow()
  })
})


