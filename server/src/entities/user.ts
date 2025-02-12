import { z } from 'zod'
import type { Selectable } from 'kysely'
import type { User } from '@server/database/types'

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
})

// TODO: review this, bad practice
export const userKeysAll = Object.keys(userSchema.shape) as (keyof User)[]

export const userKeysPublic = ['id', 'firstName', 'lastName'] as const

export type UserPublic = Pick<Selectable<User>, (typeof userKeysPublic)[number]>

export const authUserSchema = userSchema.pick({ id: true })
export type AuthUser = z.infer<typeof authUserSchema>
