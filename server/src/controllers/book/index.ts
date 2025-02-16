import { router } from '@server/trpc'
import fetchBooksFromAPI from './fetchBooksFromAPI'
import addBook from './addBook'
import getBookByISBN from './getBookByISBN'

export default router({
  fetchBooksFromAPI,
  addBook,
  getBookByISBN
})
