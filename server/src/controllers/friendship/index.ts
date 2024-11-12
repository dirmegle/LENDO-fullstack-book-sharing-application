import { router } from '@server/trpc'
import sendFriendRequest from './sendFriendRequest'

export default router({
  sendFriendRequest,
})
