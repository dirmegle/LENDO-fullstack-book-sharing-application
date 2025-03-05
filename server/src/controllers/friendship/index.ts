import { router } from '@server/trpc'
import sendFriendRequest from './sendFriendRequest'
import updateFriendship from './updateFriendship'
import getFriendship from './getFriendship'

export default router({
  sendFriendRequest,
  updateFriendship,
  getFriendship
})
