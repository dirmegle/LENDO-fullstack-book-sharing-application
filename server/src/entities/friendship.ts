import type { Friendship } from '@server/database'
import { z } from 'zod'

export const friendshipStatus = ['pending', 'accepted', 'declined'] as const

export const friendshipSchema = z.object({
  id: z.string().uuid(),
  fromUserId: z.string().uuid(),
  toUserId: z.string().uuid(),
  status: z.enum(friendshipStatus),
})

export const friendshipKeys = Object.keys(
  friendshipSchema.shape
) as (keyof Friendship)[]
