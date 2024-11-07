import { router } from '../trpc'
import user from './user'
import book from './book'
import bookCopy from './bookCopy'

export const appRouter = router({
  user,
  book,
  bookCopy,
})

export type AppRouter = typeof appRouter
