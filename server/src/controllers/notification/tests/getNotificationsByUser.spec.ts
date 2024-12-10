import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeFriendshipWithId,
  fakeNotificationWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import messages from '@server/services/notification/notificationMessages'
import { insertAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import notificationRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(notificationRouter)

const [triggeredByUser, user] = [fakeUserWithId(), fakeUserWithId()]
const friendship = fakeFriendshipWithId({
  fromUserId: triggeredByUser.id,
  toUserId: user.id,
  status: 'pending',
})

const notification = fakeNotificationWithId({
  triggeredById: triggeredByUser.id,
  userId: user.id,
  entityType: 'friendship',
  entityId: friendship.id,
  message: messages.friendshipRequestMessage(
    `${triggeredByUser.firstName} ${triggeredByUser.lastName}`
  ),
})

beforeAll(async () => {
  await insertAll(db, 'user', [triggeredByUser, user])
  await insertAll(db, 'friendship', [friendship])
  await insertAll(db, 'notification', [notification])
})

describe('getNotificationsByUser', () => {
  it('throws an error if user is not authenticated', async () => {
    const { getNotificationsByUser } = createCaller(requestContext({ db }))

    await expect(getNotificationsByUser()).rejects.toThrow(/unauthenticated/i)
  })
  it('returns an array of notifications for user', async () => {
    const { getNotificationsByUser } = createCaller(authContext({ db }, user))

    const [result] = await getNotificationsByUser()

    expect(result.id).toEqual(notification.id)
  })
  it('returns an empty array if notifications for user does not exist', async () => {
    const { getNotificationsByUser } = createCaller(
      authContext({ db }, triggeredByUser)
    )

    const result = await getNotificationsByUser()

    expect(result).toEqual([])
  })
})
