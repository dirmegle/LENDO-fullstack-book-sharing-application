import { router } from '@server/trpc'
import getBookByTitle from './getBookByTitle'

export default router({
  getBookByTitle,
})
