import type { BookCopy } from '@server/database/types'
import { z } from 'zod'

export const bookCopySchema = z.object({
  id: z.string().uuid(),
  isbn: z.string().min(1),
  isAvailable: z.boolean(),
  isLendable: z.boolean(),
  ownerId: z.string().uuid().min(1),
})

export const bookCopyKeys = Object.keys(bookCopySchema.shape) as (keyof BookCopy)[]
