import type { Book } from '@server/database'
import { z } from 'zod'

export const bookSchema = z.object({
  title: z.string(),
  author: z.string().min(1),
  coverImage: z.string(),
  description: z.string().min(1),
  isbn: z.string().min(1),
  categories: z.string(),
})

type OnlyOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? { [P in K]: T[P] } & Partial<Record<Exclude<keyof T, K>, never>>
  : never

export type BookRequest = OnlyOne<Pick<Book, 'author' | 'title' | 'isbn'>>
