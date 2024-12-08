import type { Database, ReservationStatusEnum } from '@server/database'
import { type ReservationWithISOString } from '@server/entities/reservation'
import type { Selectable, Updateable } from 'kysely'
import {
  mapISOStringObjectArray,
  mapISOStringSingleObject,
} from './utils/returnWithISOStrings'

const dateProperties = ['startDate', 'endDate']

export function reservationsRepository(db: Database) {
  return {
    async create(
      reservation: ReservationWithISOString
    ): Promise<ReservationWithISOString> {
      const startDate = new Date(reservation.startDate)
      const endDate = new Date(reservation.endDate)

      if (endDate < startDate) {
        throw new Error('End date must be bigger than start date')
      }

      const savedReservation = await db
        .insertInto('reservation')
        .values({
          id: reservation.id,
          bookCopyId: reservation.bookCopyId,
          reserverId: reservation.reserverId,
          status: reservation.status,
          startDate,
          endDate,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(
        savedReservation,
        dateProperties
      ) as ReservationWithISOString
    },

    async getReservationsByBookCopyId(
      bookCopyId: string
    ): Promise<Selectable<ReservationWithISOString>[]> {
      const reservations = await db
        .selectFrom('reservation')
        .selectAll()
        .where('bookCopyId', '=', bookCopyId)
        .execute()

      return mapISOStringObjectArray(
        reservations,
        dateProperties
      ) as ReservationWithISOString[]
    },

    async getDatesByBookCopyId(
      bookCopyId: string
    ): Promise<
      Selectable<Pick<ReservationWithISOString, 'startDate' | 'endDate'>>[]
    > {
      const reservationDates = await db
        .selectFrom('reservation')
        .select(['startDate', 'endDate'])
        .where('bookCopyId', '=', bookCopyId)
        .execute()

      return reservationDates.map((reservation) => ({
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
      }))
    },

    async getReservationsByOwnerId(
      ownerId: string
    ): Promise<Selectable<ReservationWithISOString>[]> {
      const reservations = await db
        .selectFrom('reservation')
        .innerJoin('bookCopy', 'bookCopy.id', 'reservation.bookCopyId')
        .select([
          'reservation.id',
          'reservation.bookCopyId',
          'reservation.startDate',
          'reservation.endDate',
          'reservation.reserverId',
          'reservation.status',
        ])
        .where('bookCopy.ownerId', '=', ownerId)
        .execute()

      return mapISOStringObjectArray(
        reservations,
        dateProperties
      ) as ReservationWithISOString[]
    },

    async getReservationsByReserverId(
      reserverId: string
    ): Promise<Selectable<ReservationWithISOString>[]> {
      const reservations = await db
        .selectFrom('reservation')
        .selectAll()
        .where('reserverId', '=', reserverId)
        .execute()

      return mapISOStringObjectArray(
        reservations,
        dateProperties
      ) as ReservationWithISOString[]
    },

    async getReservationById(
      id: string
    ): Promise<Selectable<ReservationWithISOString>> {
      const reservation = await db
        .selectFrom('reservation')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(
        reservation,
        dateProperties
      ) as ReservationWithISOString
    },

    async updateStatus(
      id: string,
      status: ReservationStatusEnum
    ): Promise<ReservationWithISOString> {
      const updatedReservation = await db
        .updateTable('reservation')
        .set({ status })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(
        updatedReservation,
        dateProperties
      ) as ReservationWithISOString
    },

    async updateDates(
      id: string,
      startDate: string,
      endDate: string
    ): Promise<Updateable<ReservationWithISOString>> {
      if (endDate < startDate) {
        throw new Error('End date must be bigger than start date')
      }

      const updatedReservation = await db
        .updateTable('reservation')
        .set({ endDate: new Date(endDate), startDate: new Date(startDate) })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(
        updatedReservation,
        dateProperties
      ) as ReservationWithISOString
    },
  }
}
