import { router } from '@server/trpc'
import getNotificationsByUser from './getNotificationsByUser'

export default router({ getNotificationsByUser })
