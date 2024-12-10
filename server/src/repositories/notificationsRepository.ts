import type { Database } from '@server/database'
import type { Notification } from '@server/database/types'
import type { NotificationWithISOCreatedAt } from '@server/entities/notification'
import type { Updateable } from 'kysely'
import { mapISOStringObjectArray } from './utils/returnWithISOStrings'

export function notificationsRepository(db: Database) {
  return {
    async create(
      notification: Omit<Notification, 'createdAt'>
    ): Promise<Pick<Notification, 'id'>> {
      return db
        .insertInto('notification')
        .values(notification)
        .returning('id')
        .executeTakeFirstOrThrow()
    },

    async updateNotificationAsRead(
      id: string
    ): Promise<Updateable<Notification> | undefined> {
      return db
        .updateTable('notification')
        .set({ isRead: true })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
    },

    async getNotificationsByUser(
      userId: string
    ): Promise<NotificationWithISOCreatedAt[]> {
      const notifications = await db
        .selectFrom('notification')
        .selectAll()
        .where('notification.userId', '=', userId)
        .execute()

      return mapISOStringObjectArray(notifications, [
        'createdAt',
      ]) as NotificationWithISOCreatedAt[]
    },
  }
}
