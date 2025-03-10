import type { BookCopy, Database } from '@server/database'
import { bookCopyKeys } from '@server/entities/bookCopy'
import { sql, type Selectable, type Updateable } from 'kysely'

export function bookCopyRepository(db: Database) {
  return {
    async create(bookCopy: BookCopy): Promise<BookCopy> {
      return db
        .insertInto('bookCopy')
        .values(bookCopy)
        .returning(bookCopyKeys)
        .executeTakeFirstOrThrow()
    },

    async getByOwnerId(
      ownerId: string
    ): Promise<BookCopy[]> {
      return db
        .selectFrom('bookCopy')
        .select(bookCopyKeys)
        .where('ownerId', '=', ownerId)
        .where('isAvailable', '=', true)
        .execute()
    },

    async getById(id: string): Promise<Selectable<BookCopy> | undefined> {
      return db
        .selectFrom('bookCopy')
        .select(bookCopyKeys)
        .where('bookCopy.id', '=', id)
        .executeTakeFirst()
    },

    async getByISBNAndOwnerId(
      isbn: string,
      ownerId: string
    ): Promise<Selectable<BookCopy> | undefined> {
      return db
        .selectFrom('bookCopy')
        .select(bookCopyKeys)
        .where('ownerId', '=', ownerId)
        .where('isbn', 'like', `%${isbn}%`)
        .executeTakeFirst()
    },

    async getBookCopiesByFriends(userId: string): Promise<BookCopy[]> {
      return db
        .selectFrom('bookCopy')
        .selectAll('bookCopy')
        .innerJoin('friendship', (join) =>
          join
            .on('friendship.status', '=', 'accepted')
            .on((eb) =>
              eb.or([
                eb.and([
                  eb('friendship.fromUserId', '=', userId),
                  eb('friendship.toUserId', '=', eb.ref('bookCopy.ownerId')),
                ]),
                eb.and([
                  eb('friendship.toUserId', '=', userId),
                  eb('friendship.fromUserId', '=', eb.ref('bookCopy.ownerId')),
                ]),
              ])
            )
        )
        .execute()
    },

    async getBookCopiesByFriendsAndISBN(userId: string, isbn: string): Promise<Pick<BookCopy, 'id'>[]> {
      return db
        .selectFrom('bookCopy')
        .select(['bookCopy.id'])
        .innerJoin('friendship', (join) =>
          join
            .on('friendship.status', '=', 'accepted')
            .on((eb) =>
              eb.or([
                eb.and([
                  eb('friendship.fromUserId', '=', userId),
                  eb('friendship.toUserId', '=', eb.ref('bookCopy.ownerId')),
                ]),
                eb.and([
                  eb('friendship.toUserId', '=', userId),
                  eb('friendship.fromUserId', '=', eb.ref('bookCopy.ownerId')),
                ]),
              ])
            )
        )
        .where('bookCopy.isbn', '=', isbn)
        .execute()
    },

    async updateLendability(id: string): Promise<Updateable<BookCopy>> {
      return db
        .updateTable('bookCopy')
        .set({ isLendable: sql`NOT "is_lendable"` })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async updateAvailability(id: string): Promise<Updateable<BookCopy>> {
      return db
        .updateTable('bookCopy')
        .set({
          isAvailable: sql`CASE WHEN "is_available" THEN FALSE ELSE TRUE END`,
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
    },

    async removeBookCopy(id: string): Promise<Updateable<BookCopy>> {
      return db
        .updateTable('bookCopy')
        .set({ isAvailable: sql`NOT "is_available"` })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}
