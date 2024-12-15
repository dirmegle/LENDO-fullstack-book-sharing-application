import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import type { BookRequest } from '@server/entities/book'
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure/index'
import fetchBooks from './utils/fetchBooks'

export const inputSchema = z
  .object({
    title: z.string().optional(),
    author: z.string().optional(),
    isbn: z.string().optional(),
  })
  .refine(
    (data) => {
      const definedFields = Object.values(data).filter(
        (value) => value !== undefined && value !== ''
      )
      return definedFields.length === 1
    },
    {
      message: 'You must provide exactly one of title, author, or isbn.',
      path: ['title', 'author', 'isbn'],
    }
  )

export default authenticatedProcedure
  .input(inputSchema)
  .query(async ({ input }) => {
    const definedFields = Object.values(input).filter(
      (value) => value !== undefined && value !== ''
    )

    if (definedFields.length !== 1) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Incorrect search request - provide either title, author or isbn',
      })
    }

    const validatedInput = input as BookRequest

    try {
      const bookList = await fetchBooks(validatedInput)
      return bookList
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'Could not fetch book data',
      })
    }
  })
