import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import updateEmail from './updateEmail'
import getCurrentUser from './getCurrentUser'

export default router({
  login,
  signup,
  updateEmail,
  getCurrentUser
})
