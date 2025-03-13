import { router } from '@server/trpc'
import getNotificationsByUser from './getNotificationsByUser'
import setNotificationAsRead from './setNotificationAsRead'

export default router({ getNotificationsByUser, setNotificationAsRead })
