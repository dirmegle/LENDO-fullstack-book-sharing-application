import { router } from '@server/trpc'
import addBookCopy from './addBookCopy'
import getBookCopiesByUser from './getBookCopiesByUser'
import getBookCopyId from './getBookCopyId'
import removeBookCopy from './removeBookCopy'
import getBookCopiesFromFriendsByISBN from './getBookCopiesFromFriendsByISBN'
import getBookCopiesFromFriends from './getBookCopiesFromFriends'

export default router({
  addBookCopy,
  getBookCopiesByUser,
  getBookCopyId,
  removeBookCopy,
  getBookCopiesFromFriendsByISBN,
  getBookCopiesFromFriends
})
