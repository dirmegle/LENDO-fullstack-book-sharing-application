import { trpc } from '@/trpc'
import { Book } from '@server/shared/types'

const addBook = async (book: Book) => {
  try {
    const existingBook = await trpc.book.getBookByISBN.query({ isbn: book.isbn })
    if (!existingBook) {
      await trpc.book.addBook.mutate(book)
    }
  } catch (e) {
    throw new Error(`${e}`)
  }
}

export default addBook
