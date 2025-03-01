import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import updateEmail from './updateEmail'
import getCurrentUser from './getCurrentUser'
import getUserById from './getUserById'

export default router({
  login,
  signup,
  updateEmail,
  getCurrentUser,
  getUserById
})
