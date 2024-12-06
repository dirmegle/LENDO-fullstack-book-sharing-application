import { createCallerFactory } from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeBook,
  fakeBookCopyWithId,
  fakeFriendshipWithId,
  fakeReservationWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import messages from '@server/services/notification/notificationMessages'
import { random } from '@tests/utils/random'
import friendshipRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(friendshipRouter)

const fromUser = fakeUserWithId()
const toUser = fakeUserWithId()
const friendship = fakeFriendshipWithId({
  fromUserId: fromUser.id,
  toUserId: toUser.id,
})

const book = fakeBook()

const bookCopy = fakeBookCopyWithId({
  isbn: book.isbn,
  ownerId: fromUser.id,
  isLendable: true,
})

beforeAll(async () => {
  await insertAll(db, 'user', [fromUser, toUser])
  await insertAll(db, 'friendship', [friendship])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'bookCopy', [bookCopy])
})

describe('updateFriendship', () => {
  it('throws an error if user is unauthenticated', async () => {
    const { updateFriendship } = createCaller(requestContext({ db }))
    await expect(
      updateFriendship({ id: friendship.id, status: 'accepted' })
    ).rejects.toThrow(/unauthenticated/i)
  })

  it('updates friendship with accepted status and creates notification', async () => {
    const { updateFriendship } = createCaller(authContext({ db }, fromUser))
    await updateFriendship({ id: friendship.id, status: 'accepted' })

    const [updatedFriendship] = await selectAll(db, 'friendship', (q) =>
      q('id', '=', friendship.id)
    )
    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('triggeredById', '=', fromUser.id)
    )

    expect(updatedFriendship.status).toEqual('accepted')
    expect(createdNotification.message).toEqual(
      messages.friendshipAcceptMessage(
        `${fromUser.firstName} ${fromUser.lastName}`
      )
    )
  })

  it('updates friendship with declined status and creates notification', async () => {
    const { updateFriendship } = createCaller(authContext({ db }, fromUser))
    await updateFriendship({ id: friendship.id, status: 'declined' })

    const [updatedFriendship] = await selectAll(db, 'friendship', (q) =>
      q('id', '=', friendship.id)
    )
    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('triggeredById', '=', fromUser.id)
    )

    expect(updatedFriendship.status).toEqual('declined')
    expect(createdNotification.message).toEqual(
      messages.friendshipDeclineMessage(
        `${fromUser.firstName} ${fromUser.lastName}`
      )
    )
  })

  it('throws an error if status is deleted and there are existing reservations', async () => {
    await insertAll(db, 'reservation', [
      fakeReservationWithId({ reserverId: toUser.id, bookCopyId: bookCopy.id }),
    ])

    const { updateFriendship } = createCaller(authContext({ db }, fromUser))
    await expect(
      updateFriendship({ id: friendship.id, status: 'deleted' })
    ).rejects.toThrow()
  })

  it('updates friendship with deleted status if there are no existing reservations and creates notification', async () => {
    const { updateFriendship } = createCaller(authContext({ db }, fromUser))
    await updateFriendship({ id: friendship.id, status: 'deleted' })

    const [updatedFriendship] = await selectAll(db, 'friendship', (q) =>
      q('id', '=', friendship.id)
    )
    const [createdNotification] = await selectAll(db, 'notification', (q) =>
      q('triggeredById', '=', fromUser.id)
    )

    expect(updatedFriendship.status).toEqual('deleted')
    expect(createdNotification.message).toEqual(
      messages.friendshipDeletionMessage(
        `${fromUser.firstName} ${fromUser.lastName}`
      )
    )
  })

  it('throws an error if friendship to be updated is not found', async () => {
    const { updateFriendship } = createCaller(authContext({ db }, fromUser))
    await expect(
      updateFriendship({ id: random.guid(), status: 'deleted' })
    ).rejects.toThrow()
  })

  it('throws an error if the friendship is being updated to pending status', async () => {
    const { updateFriendship } = createCaller(authContext({ db }, fromUser))
    await expect(
      updateFriendship({ id: friendship.id, status: 'pending' })
    ).rejects.toThrow()
  })
})
