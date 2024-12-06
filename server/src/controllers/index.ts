import { router } from '../trpc'
import user from './user'
import book from './book'
import bookCopy from './bookCopy'
import friendship from './friendship'
import reservation from './reservation'

export const appRouter = router({
  user,
  book,
  bookCopy,
  friendship,
  reservation
})

export type AppRouter = typeof appRouter
