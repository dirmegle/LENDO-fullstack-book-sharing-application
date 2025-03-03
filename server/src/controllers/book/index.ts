import { router } from '@server/trpc'
import fetchBooksFromAPI from './fetchBooksFromAPI'
import addBook from './addBook'
import getBookByISBN from './getBookByISBN'
import getBookByBookCopyId from './getBookByBookCopyId'

export default router({
  fetchBooksFromAPI,
  addBook,
  getBookByISBN,
  getBookByBookCopyId
})
 