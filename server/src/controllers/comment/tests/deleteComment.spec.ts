import {
  fakeBook,
  fakeCommentWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll, selectAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import { authContext, requestContext } from '@tests/utils/context'
import { random } from '@tests/utils/random'
import commentRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(commentRouter)

const book = fakeBook()
const [user, otherUser] = [fakeUserWithId(), fakeUserWithId()]
const comment = fakeCommentWithId({ userId: user.id, isbn: book.isbn })

beforeAll(async () => {
  await insertAll(db, 'book', [book])
  await insertAll(db, 'user', [user, otherUser])
  await insertAll(db, 'comment', [comment])
})

describe('deleteComment', () => {
  it('throws an error if user is unauthenticated', async () => {
    const { deleteComment } = createCaller(requestContext({ db }))

    await expect(deleteComment({ id: comment.id })).rejects.toThrow(
      /unauthenticated/i
    )
  })
  it('deletes comment successfully if authorized user is author', async () => {
    const { deleteComment } = createCaller(authContext({ db }, user))

    const result = await deleteComment({ id: comment.id })

    expect(result.id).toEqual(comment.id)

    const [deletedComment] = await selectAll(db, 'comment', (q) =>
      q('comment.id', '=', comment.id)
    )

    expect(deletedComment).toBeUndefined()
  })
  it('throws an error if authorized user is not author of comment', async () => {
    const { deleteComment } = createCaller(authContext({ db }, otherUser))

    await expect(deleteComment({ id: comment.id })).rejects.toThrow()
  })
  it('throws error if comment is not found', async () => {
    const { deleteComment } = createCaller(authContext({ db }, user))

    await expect(deleteComment({ id: random.guid() })).rejects.toThrow()
  })
})
