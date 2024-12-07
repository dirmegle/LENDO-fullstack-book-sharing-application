import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeBook,
  fakeCommentWithId,
  fakeFriendshipWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { random } from '@tests/utils/random'
import { commentRepository } from '../commentRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = commentRepository(db)

const [user1, user2, user3] = [
  fakeUserWithId(),
  fakeUserWithId(),
  fakeUserWithId(),
]
const book = fakeBook()

beforeAll(async () => {
  await insertAll(db, 'user', [user1, user2, user3])
  await insertAll(db, 'book', [book])
  await insertAll(db, 'friendship', [
    fakeFriendshipWithId({
      fromUserId: user1.id,
      toUserId: user2.id,
      status: 'accepted',
    }),
  ])
})

describe('create', () => {
  it('creates comment if input is correct', async () => {
    const comment = fakeCommentWithId({ userId: user1.id, isbn: book.isbn })
    const response = await repository.create(comment)
    expect(response.content).toEqual(comment.content)
  })
})

describe('updateContent', () => {
  it('updates existing comment text successfully', async () => {
    const [existingComment] = await insertAll(db, 'comment', [
      fakeCommentWithId({ userId: user1.id, isbn: book.isbn }),
    ])

    const updatedText = random.string()

    const response = await repository.updateContent(
      existingComment.id,
      user1.id,
      updatedText
    )

    expect(response.content).toEqual(updatedText)
  })
  it('throws an error if comment does not exist', async () => {
    await expect(
      repository.updateContent(random.guid(), user1.id, 'New text')
    ).rejects.toThrow()
  })
  it('throws an error if user is not the author of comment', async () => {
    const [existingComment] = await insertAll(db, 'comment', [
      fakeCommentWithId({ userId: user1.id, isbn: book.isbn }),
    ])

    const updatedText = random.string()

    await expect(
      repository.updateContent(existingComment.id, user2.id, updatedText)
    ).rejects.toThrow()
  })
})

describe('getByBook', () => {
  it('returns array of comments for book when comments public', async () => {
    const publicComment1 = fakeCommentWithId({
      userId: user1.id,
      isbn: book.isbn,
      public: true,
    })
    const publicComment2 = fakeCommentWithId({
      userId: user2.id,
      isbn: book.isbn,
      public: true,
    })

    await insertAll(db, 'comment', [publicComment1, publicComment2])

    const result = await repository.getByBook(book.isbn, user3.id)

    expect(result.length).toEqual(2)
  })
  it('returns non-public comments if users are friends', async () => {
    const commentByFriend = fakeCommentWithId({
      userId: user2.id,
      isbn: book.isbn,
      public: false,
    })

    const commentByNotFriend = fakeCommentWithId({
      userId: user3.id,
      isbn: book.isbn,
      public: false,
    })

    await insertAll(db, 'comment', [commentByFriend, commentByNotFriend])

    const [result] = await repository.getByBook(book.isbn, user1.id)

    expect(result.id).toEqual(commentByFriend.id)
  })
  it('returns an empty array if there are no comments for the book', async () => {
    const result = await repository.getByBook(book.isbn, user1.id)
    expect(result.length).toEqual(0)
  })
})

describe('delete', () => {
  it('deleted comment if user is author', async () => {
    const [existingComment] = await insertAll(db, 'comment', [
      fakeCommentWithId({ userId: user1.id, isbn: book.isbn }),
    ])

    await repository.delete(existingComment.id, user1.id)

    const comments = await selectAll(db, 'comment', (q) =>
      q('comment.id', '=', existingComment.id)
    )

    expect(comments.length).toEqual(0)
  })
  it('throws an error if user is not author', async () => {
    const [existingComment] = await insertAll(db, 'comment', [
      fakeCommentWithId({ userId: user1.id, isbn: book.isbn }),
    ])

    await expect(
      repository.delete(existingComment.id, user2.id)
    ).rejects.toThrow()
  })
})
