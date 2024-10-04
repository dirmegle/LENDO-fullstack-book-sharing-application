import { z } from 'zod'

export const bookSchema = z.object({
  author: z.string().min(1),
  coverImage: z.string(),
  description: z.string().min(1),
  isbn: z.string().min(10).max(13),
  pageCount: z.number(),
  title: z.string(),
})
