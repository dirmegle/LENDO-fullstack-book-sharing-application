import type { Reservation } from '@server/database/types'
import { z } from 'zod'

export const reservationStatus = [
  'pending',
  'confirmed',
  'rejected',
  'cancelled',
  'completed',
] as const

const currentDate = new Date()

export const reservationSchema = z.object({
  id: z.string().uuid().min(1),
  bookCopyId: z.string().uuid().min(1),
  reserverId: z.string().uuid().min(1),
  status: z.enum(reservationStatus),
  startDate: z
    .string()
    .refine((date) => Date.parse(date) && new Date(date) >= currentDate, {
      message: 'Start date must be a valid ISO string and not in the past',
    }),
  endDate: z
    .string()
    .refine((date) => Date.parse(date) && new Date(date) >= currentDate, {
      message: 'End date must be a valid ISO string and not in the past',
    }),
})

export type ReservationWithISOString = Omit<
  Reservation,
  'startDate' | 'endDate'
> & {
  startDate: string
  endDate: string
}

export const reservationKeys = Object.keys(
  reservationSchema.shape
) as (keyof Reservation)[]
