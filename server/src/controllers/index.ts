import { router } from '../trpc'
import user from './user'
import book from './book'
import bookCopy from './bookCopy'
import friendship from './friendship'

export const appRouter = router({
  user,
  book,
  bookCopy,
  friendship,
})

export type AppRouter = typeof appRouter
