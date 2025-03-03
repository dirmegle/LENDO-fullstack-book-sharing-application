import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import updateEmail from './updateEmail'
import getCurrentUser from './getCurrentUser'
import getUserById from './getUserById'
import getOwnerUserByCopyId from './getOwnerUserByCopyId'

export default router({
  login,
  signup,
  updateEmail,
  getCurrentUser,
  getUserById,
  getOwnerUserByCopyId
})
