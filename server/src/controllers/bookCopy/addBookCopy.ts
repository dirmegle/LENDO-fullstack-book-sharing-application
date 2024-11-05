import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '@server/trpc/provideRepos'
import { bookCopySchema } from '@server/entities/bookCopy'
import { TRPCError } from '@trpc/server'
import { v4 as uuidv4 } from 'uuid'
import { bookCopyRepository } from '../../repositories/bookCopyRepository'

export default authenticatedProcedure
  .use(provideRepos({ bookCopyRepository }))
  .input(bookCopySchema.omit({ id: true, ownerId: true }))
  .mutation(async ({ input: bookCopy, ctx: { authUser, repos } }) => {
    const existingBookCopy = await repos.bookCopyRepository.getByISBNAndOwnerId(
      bookCopy.isbn,
      authUser.id
    )

    if (existingBookCopy) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Book copy with this ISBN for this user already exists',
      })
    }

    const id = uuidv4()

    const createdBookCopy = await repos.bookCopyRepository.create({
      ...bookCopy,
      id,
      ownerId: authUser.id,
    })

    return createdBookCopy
  })
