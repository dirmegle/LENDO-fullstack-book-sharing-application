import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeNotificationWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { uuidRegex } from '@tests/utils/regex'
import { notificationsRepository } from '../notificationsRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = notificationsRepository(db)

const [fromUser, toUser] = await insertAll(db, 'user', [
  fakeUserWithId(),
  fakeUserWithId(),
])

describe('create', () => {
  it('creates a notification', async () => {
    const notification = fakeNotificationWithId({
      userId: toUser.id,
      triggeredById: fromUser.id,
    })
    const response = await repository.create(notification)

    expect(response.id).toMatch(uuidRegex)
  })
})

describe('updateNotificationAsRead', () => {
  it('changes notification isRead to true', async () => {
    const [existingNotification] = await insertAll(
      db,
      'notification',
      fakeNotificationWithId({
        userId: toUser.id,
        triggeredById: fromUser.id,
      })
    )

    const response = await repository.updateNotificationAsRead(
      existingNotification.id
    )

    expect(response?.isRead).toBe(true)
  })
})
