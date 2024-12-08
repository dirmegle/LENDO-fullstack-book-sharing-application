import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import {
  fakeBook,
  fakeCommentWithoutId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { authContext, requestContext } from '@tests/utils/context'
import {
  testMissingFields,
  testUndefinedFields,
} from '@tests/utils/undefinedMissingFields'
import { commentKeys } from '@server/entities/comment'
import commentRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(commentRouter)

const book = fakeBook()
const user = fakeUserWithId()

beforeAll(async () => {
  await insertAll(db, 'book', [book])
  await insertAll(db, 'user', [user])
})

describe('create', () => {
  it('throws an error if user is not authenticated', async () => {
    const { createComment } = createCaller(requestContext({ db }))

    const comment = fakeCommentWithoutId({ userId: user.id, isbn: book.isbn })

    await expect(createComment(comment)).rejects.toThrow(/unauthenticated/i)
  })
  it('creates comment for the book if input is correct', async () => {
    const { createComment } = createCaller(authContext({ db }, user))

    const comment = fakeCommentWithoutId({ userId: user.id, isbn: book.isbn })

    const response = await createComment(comment)

    expect(response.content).toEqual(comment.content)
  })
  it('throws an error if book does not exist', async () => {
    const { createComment } = createCaller(authContext({ db }, user))

    const comment = fakeCommentWithoutId({
      userId: user.id,
      isbn: '1234567891',
    })

    await expect(createComment(comment)).rejects.toThrow()
  })
  it('throws an error if any of the fields are missing', async () => {
    const { createComment } = createCaller(authContext({ db }, user))

    const comment = (overrides: Partial<any>) =>
      fakeCommentWithoutId({
        isbn: book.isbn,
        ...overrides,
      })

    testMissingFields(commentKeys, ['id', 'userId'], comment, createComment)
  })
  it('throws an error if any of the fields are undefined', async () => {
    const { createComment } = createCaller(authContext({ db }, user))

    const comment = (overrides: Partial<any>) =>
      fakeCommentWithoutId({
        isbn: book.isbn,
        ...overrides,
      })

    testUndefinedFields(commentKeys, ['id', 'userId'], comment, createComment)
  })
})
