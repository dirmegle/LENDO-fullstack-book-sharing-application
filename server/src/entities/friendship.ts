import type { Friendship } from '@server/database'
import { z } from 'zod'

export const friendshipStatus = ['pending', 'accepted', 'declined', 'deleted'] as const

export const friendshipSchema = z.object({
  id: z.string().uuid(),
  fromUserId: z.string().uuid().min(1),
  toUserId: z.string().uuid().min(1),
  status: z.enum(friendshipStatus),
})

export const friendshipKeys = Object.keys(
  friendshipSchema.shape
) as (keyof Friendship)[]
