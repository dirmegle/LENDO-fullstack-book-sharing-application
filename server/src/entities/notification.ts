import type { Notification } from '@server/database'
import { z } from 'zod'

export const notificationTypes = [
  'friendship',
  'reservation',
  'comment',
] as const

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  triggeredById: z.string().uuid(),
  entityType: z.enum(notificationTypes),
  entityId: z.string().uuid(),
  message: z.string().min(1),
  isRead: z.boolean(),
})

export const notificationKeys = Object.keys(
  notificationSchema.shape
) as (keyof Notification)[]
