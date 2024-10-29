import { router } from '@server/trpc'
import fetchBooksFromAPI from './fetchBooksFromAPI'
import addBook from './addBook'

export default router({
  fetchBooksFromAPI,
  addBook,
})
