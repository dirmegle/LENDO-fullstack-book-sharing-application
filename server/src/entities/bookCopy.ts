import { z } from 'zod'

export const bookCopySchema = z.object({
  id: z.string().uuid(),
  isbn: z.string().min(10).max(13),
  isAvailable: z.boolean(),
  isLendable: z.boolean(),
  ownerId: z.string().uuid(),
})
