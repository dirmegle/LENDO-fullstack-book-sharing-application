import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { notificationsRepository } from '@server/repositories/notificationsRepository'
import {
  fakeFriendshipWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { userRepository } from '@server/repositories/userRepository'
import { random } from '@tests/utils/random'
import createNotification from '../createNotification'
import messages from '../notificationMessages'

const db = await wrapInRollbacks(createTestDatabase())
const notificationsRepo = notificationsRepository(db)
const userRepo = userRepository(db)

const fromUser = fakeUserWithId()
const toUser = fakeUserWithId()
const friendship = fakeFriendshipWithId({
  fromUserId: fromUser.id,
  toUserId: toUser.id,
})

beforeAll(async () => {
  await insertAll(db, 'user', [fromUser, toUser])
  await insertAll(db, 'friendship', [friendship])
})

describe('createNotification', () => {
  it('successfully creates a notification for pending friendship', async () => {
    await createNotification(
      'friendship',
      friendship.id,
      friendship.status,
      toUser.id,
      fromUser.id,
      { notificationsRepository: notificationsRepo, userRepository: userRepo }
    )

    const [newNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', fromUser.id)
    )

    const message = messages.friendshipRequestMessage(
      `${fromUser.firstName} ${fromUser.lastName}`
    )

    expect(newNotification.entityId).toEqual(friendship.id)
    expect(newNotification.entityType).toEqual('friendship')
    expect(newNotification.entityType).toEqual('friendship')
    expect(newNotification.isRead).toEqual(false)
    expect(newNotification.triggeredById).toEqual(fromUser.id)
    expect(newNotification.userId).toEqual(toUser.id)
    expect(newNotification.message).toEqual(message)
  })

  it('throws an error if full fromUser profile cannot be retrieved', async () => {
    await expect(
      createNotification(
        'friendship',
        friendship.id,
        friendship.status,
        toUser.id,
        random.guid(),
        { notificationsRepository: notificationsRepo, userRepository: userRepo }
      )
    ).rejects.toThrow()
  })
})
