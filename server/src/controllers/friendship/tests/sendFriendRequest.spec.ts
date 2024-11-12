import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { createCallerFactory } from '@server/trpc'
import {
  fakeFriendshipWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import friendshipRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(friendshipRouter)

const [fromUser, toUser] = await insertAll(db, 'user', [
  fakeUserWithId(),
  fakeUserWithId(),
])

const correctInput = {
  toUserId: toUser.id,
}

describe('sendFriendRequest', () => {
  it('throws error if user is unauthorized', async () => {
    const { sendFriendRequest } = createCaller(requestContext({ db }))
    await expect(sendFriendRequest(correctInput)).rejects.toThrow(
      /unauthenticated/i
    )
  })
  it('creates a friendship with status pending and a notification', async () => {
    const { sendFriendRequest } = createCaller(authContext({ db }, fromUser))
    const { friendshipId, notificationId } =
      await sendFriendRequest(correctInput)

    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('notification.triggeredById', '=', fromUser.id)
    )
    const [createdFriendship] = await selectAll(db, 'friendship', (q) =>
      q('friendship.fromUserId', '=', fromUser.id)
    )

    expect(createdFriendship.id).toEqual(friendshipId)
    expect(createdFriendship.status).toEqual('pending')
    expect(createdNotification.id).toEqual(notificationId)
    expect(createdNotification.userId).toEqual(toUser.id)
    expect(createdNotification.triggeredById).toBe(fromUser.id)
  })
  it('throws an error if the friendship already exists', async () => {
    const { sendFriendRequest } = createCaller(authContext({ db }, fromUser))
    const [existingFriendship] = await insertAll(
      db,
      'friendship',
      fakeFriendshipWithId({ fromUserId: fromUser.id, toUserId: toUser.id })
    )

    await expect(
      sendFriendRequest({
        toUserId: existingFriendship.toUserId,
      })
    ).rejects.toThrow()
  })
  it('throws an error if toUser id property is undefined', async () => {
    const { sendFriendRequest } = createCaller(authContext({ db }, fromUser))

    await expect(sendFriendRequest({ toUserId: '' })).rejects.toThrow()
  })
})
