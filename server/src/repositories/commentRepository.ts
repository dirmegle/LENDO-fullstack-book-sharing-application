import type { Comment, Database, Friendship } from '@server/database'
import type { CommentWithISOCreatedAt } from '@server/entities/comment'
import type { Expression, Insertable, SqlBool, Updateable } from 'kysely'
import {
  mapISOStringObjectArray,
  mapISOStringSingleObject,
} from './utils/returnWithISOStrings'

export function commentRepository(db: Database) {
  return {
    async create(
      comment: Omit<Comment, 'createdAt'>
    ): Promise<Insertable<Comment>> {
      const newComment = await db
        .insertInto('comment')
        .values(comment)
        .returningAll()
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(newComment, [
        'createdAt',
      ]) as Insertable<Comment>
    },

    async updateContent(
      id: string,
      userId: string,
      updatedContent: string
    ): Promise<Updateable<CommentWithISOCreatedAt>> {
      const comment = await db
        .updateTable('comment')
        .set({ content: updatedContent })
        .where('comment.id', '=', id)
        .where('comment.userId', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(comment, ['createdAt'])
    },

    async getById(id: string): Promise<CommentWithISOCreatedAt | undefined> {
      const comment = await db
        .selectFrom('comment')
        .selectAll()
        .where('comment.id', '=', id)
        .executeTakeFirst()

      if (comment) {
        return mapISOStringSingleObject(comment, [
          'createdAt',
        ]) as CommentWithISOCreatedAt
      }

      return undefined
    },

    async getByBook(
      isbn: string,
      userId: string
    ): Promise<CommentWithISOCreatedAt[]> {
      const friendships: Friendship[] = await db
        .selectFrom('friendship')
        .selectAll()
        .where((eb) =>
          eb.or([
            eb('friendship.fromUserId', '=', userId),
            eb('friendship.toUserId', '=', userId),
          ])
        )
        .where('friendship.status', '=', 'accepted')
        .execute()

      const friendsArray: string[] = []

      friendships.forEach((friendship) => {
        friendsArray.push(friendship.fromUserId)
        friendsArray.push(friendship.toUserId)
      })

      const uniqueFriendsArray = Array.from(new Set(friendsArray))

      const comments = await db
        .selectFrom('comment')
        .selectAll()
        .where('comment.isbn', '=', isbn)
        .where((eb) => {
          const conditions: Expression<SqlBool>[] = [
            eb('comment.public', '=', true),
            eb('comment.userId', '=', userId),
          ]

          if (uniqueFriendsArray.length > 0) {
            conditions.push(
              eb('comment.public', '=', false).and(
                'comment.userId',
                'in',
                uniqueFriendsArray
              )
            )
          }

          return eb.or(conditions)
        })
        .execute()

      return mapISOStringObjectArray(comments, [
        'createdAt',
      ]) as CommentWithISOCreatedAt[]
    },

    async delete(
      commentId: string,
      userid: string
    ): Promise<CommentWithISOCreatedAt> {
      const deletedComment = await db
        .deleteFrom('comment')
        .returningAll()
        .where('comment.id', '=', commentId)
        .where('comment.userId', '=', userid)
        .executeTakeFirstOrThrow()

      return mapISOStringSingleObject(deletedComment, [
        'createdAt',
      ]) as CommentWithISOCreatedAt
    },
  }
}
