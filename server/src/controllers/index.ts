import { router } from '../trpc'
import user from './user'
import book from './book'
import bookCopy from './bookCopy'
import friendship from './friendship'
import reservation from './reservation'
import comment from './comment'
import notification from './notification'

export const appRouter = router({
  user,
  book,
  bookCopy,
  friendship,
  reservation,
  comment,
  notification,
})

export type AppRouter = typeof appRouter
