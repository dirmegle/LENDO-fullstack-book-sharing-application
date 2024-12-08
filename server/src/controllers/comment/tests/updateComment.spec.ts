import {
  fakeBook,
  fakeCommentWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { authContext, requestContext } from '@tests/utils/context'
import { random } from '@tests/utils/random'
import commentRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(commentRouter)

const book = fakeBook()
const [user1, user2] = [fakeUserWithId(), fakeUserWithId()]
const comment = fakeCommentWithId({ isbn: book.isbn, userId: user1.id })

beforeAll(async () => {
  await insertAll(db, 'book', [book])
  await insertAll(db, 'user', [user1, user2])
  await insertAll(db, 'comment', [comment])
})

describe('updateComment', () => {
  const newText = random.string()

  it('throws an error if user is unauthenticated', async () => {
    const { updateComment } = createCaller(requestContext({ db }))

    await expect(
      updateComment({ id: comment.id, content: newText })
    ).rejects.toThrow(/unauthenticated/i)
  })
  it('updates comment if auth user is comment author', async () => {
    const { updateComment } = createCaller(authContext({ db }, user1))

    const updatedComment = await updateComment({
      id: comment.id,
      content: newText,
    })

    expect(updatedComment.content).toEqual(newText)
  })
  it('throws an error if comment author is not authUser', async () => {
    const { updateComment } = createCaller(authContext({ db }, user2))

    await expect(
      updateComment({ id: comment.id, content: newText })
    ).rejects.toThrow()
  })
  it('throws an error if comment is not found', async () => {
    const { updateComment } = createCaller(authContext({ db }, user1))

    await expect(
      updateComment({ id: random.guid(), content: newText })
    ).rejects.toThrow()
  })
})
