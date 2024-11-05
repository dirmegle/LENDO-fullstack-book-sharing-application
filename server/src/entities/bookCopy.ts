import type { BookCopy } from '@server/database/types'
import { z } from 'zod'

export const bookCopySchema = z.object({
  id: z.string().uuid(),
  isbn: z.string(),
  isAvailable: z.boolean(),
  isLendable: z.boolean(),
  ownerId: z.string().uuid(),
})

export const bookCopyKeys = Object.keys(bookCopySchema.shape) as (keyof BookCopy)[]
