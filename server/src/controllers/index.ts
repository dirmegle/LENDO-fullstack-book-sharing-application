import { router } from '../trpc'
import user from './user'
import book from './book'

export const appRouter = router({
  user,
  book
})

export type AppRouter = typeof appRouter
