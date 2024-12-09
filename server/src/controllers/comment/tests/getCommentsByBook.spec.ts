import {
  fakeBook,
  fakeCommentWithId,
  fakeFriendshipWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { authContext, requestContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import commentRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(commentRouter)

const [mainUser, friendUser, unknownUser] = [
  fakeUserWithId(),
  fakeUserWithId(),
  fakeUserWithId(),
]

const book = fakeBook()

const friendship = fakeFriendshipWithId({
  fromUserId: mainUser.id,
  toUserId: friendUser.id,
  status: 'accepted',
})

beforeAll(async () => {
  await insertAll(db, 'user', [mainUser, friendUser, unknownUser])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'friendship', [friendship])
})

describe('getCommentsForBook', () => {
  it('throws an error if user is unauthenticated', async () => {
    const { getCommentsByBook } = createCaller(requestContext({ db }))

    const commentByFriend = fakeCommentWithId({
      userId: friendUser.id,
      isbn: book.isbn,
      public: true,
    })

    await insertAll(db, 'comment', [commentByFriend])

    await expect(getCommentsByBook({ isbn: book.isbn })).rejects.toThrow(
      /unauthenticated/i
    )
  })
  it('returns all comments if they are public', async () => {
    const { getCommentsByBook } = createCaller(authContext({ db }, mainUser))

    const commentByFriend = fakeCommentWithId({
      userId: friendUser.id,
      isbn: book.isbn,
      public: true,
    })

    const commentByOtherUser = fakeCommentWithId({
      userId: unknownUser.id,
      isbn: book.isbn,
      public: true,
    })

    await insertAll(db, 'comment', [commentByFriend, commentByOtherUser])

    const result = await getCommentsByBook({ isbn: book.isbn })

    expect(result.length).toEqual(2)
  })
  it('returns non-public comments only by friends', async () => {
    const { getCommentsByBook } = createCaller(authContext({ db }, mainUser))

    const commentByFriend = fakeCommentWithId({
      userId: friendUser.id,
      isbn: book.isbn,
      public: false,
    })

    const commentByOtherUser = fakeCommentWithId({
      userId: unknownUser.id,
      isbn: book.isbn,
      public: false,
    })

    await insertAll(db, 'comment', [commentByFriend, commentByOtherUser])

    const result = await getCommentsByBook({ isbn: book.isbn })

    expect(result.length).toEqual(1)
  })
  it('returns empty array if there are no comments for book', async () => {
    const { getCommentsByBook } = createCaller(authContext({ db }, mainUser))

    const result = await getCommentsByBook({ isbn: book.isbn })

    expect(result).toEqual([])
  })
})
