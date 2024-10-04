import { router } from '@server/trpc'
import getBooks from './getBooks'

export default router({
  getBooks,
})
