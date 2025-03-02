import { router } from '@server/trpc'
import addBookCopy from './addBookCopy'
import getBookCopiesByUser from './getBookCopiesByUser'
import getBookCopyId from './getBookCopyId'
import removeBookCopy from './removeBookCopy'
import getBookCopiesFromFriendsByISBN from './getBookCopiesFromFriendsByISBN'

export default router({
  addBookCopy,
  getBookCopiesByUser,
  getBookCopyId,
  removeBookCopy,
  getBookCopiesFromFriendsByISBN
})
