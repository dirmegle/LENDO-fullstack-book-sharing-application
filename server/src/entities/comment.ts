import type { Comment } from '@server/database'
import { z } from 'zod'

export const commentSchema = z.object({
  id: z.string().uuid(),
  isbn: z.string().min(1),
  userId: z.string().uuid().min(1),
  content: z.string().min(1),
  public: z.boolean(),
})

export type CommentWithISOCreatedAt = Omit<Comment, 'createdAt'> & {
  createdAt: string
}

export const commentKeys = Object.keys(commentSchema.shape) as (keyof Comment)[]
