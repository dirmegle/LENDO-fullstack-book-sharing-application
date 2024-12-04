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
    ): Promise<Selectable<BookCopy> | undefined> {
      return db
        .selectFrom('bookCopy')
        .select(bookCopyKeys)
        .where('ownerId', '=', ownerId)
        .executeTakeFirst()
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
        .set({ isAvailable: sql`NOT "is_available"` })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}
