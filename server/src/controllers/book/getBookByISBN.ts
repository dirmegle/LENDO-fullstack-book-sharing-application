import { bookSchema } from '@server/entities/book'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { bookRepository } from '../../repositories/bookRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookRepository }))
  .input(bookSchema.pick({isbn: true}))
  .query(async ({ input: { isbn }, ctx: { repos } }) => {
    const book = await repos.bookRepository.findByISBN(isbn)

    return book
  })
