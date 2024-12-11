import type { Notification } from '@server/database'
import { z } from 'zod'

export const notificationTypes = ['friendship', 'reservation'] as const

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().min(1),
  triggeredById: z.string().uuid().min(1),
  entityType: z.enum(notificationTypes),
  entityId: z.string().uuid().min(1),
  message: z.string().min(1),
  isRead: z.boolean(),
})

export const notificationKeys = Object.keys(
  notificationSchema.shape
) as (keyof Notification)[]

export type NotificationWithISOCreatedAt = Omit<Notification, 'createdAt'> & {
  createdAt: string
}
