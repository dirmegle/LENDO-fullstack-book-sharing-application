import { bookSchema } from '@server/entities/book'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { TRPCError } from '@trpc/server'
import { bookRepository } from '../../repositories/bookRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookRepository }))
  .input(bookSchema)
  .mutation(async ({ input: book, ctx: { repos } }) => {
    const existingBook = await repos.bookRepository.findByISBN(book.isbn)

    if (existingBook) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Book with this ISBN already exists',
      })
    }

    const createdBook = await repos.bookRepository.create(book)

    return createdBook
  })
