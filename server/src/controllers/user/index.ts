import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import updateEmail from './updateEmail'
import getCurrentUser from './getCurrentUser'
import getUserById from './getUserById'
import getOwnerUserByCopyId from './getOwnerUserByCopyId'
import getFriendUsers from './getFriendUsers'
import getUsersByName from './getUsersByName'

export default router({
  login,
  signup,
  updateEmail,
  getCurrentUser,
  getUserById,
  getOwnerUserByCopyId,
  getFriendUsers,
  getUsersByName
})
