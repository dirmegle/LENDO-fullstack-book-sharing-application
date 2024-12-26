import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import updateEmail from './updateEmail'

export default router({
  login,
  signup,
  updateEmail
})
