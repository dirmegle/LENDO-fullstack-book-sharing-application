import { router } from '@server/trpc'
import sendFriendRequest from './sendFriendRequest'
import updateFriendship from './updateFriendship'

export default router({
  sendFriendRequest,
  updateFriendship,
})
