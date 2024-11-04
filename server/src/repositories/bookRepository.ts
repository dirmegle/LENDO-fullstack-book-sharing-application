import type { Book, Database } from '@server/database'
import { bookKeys } from '@server/entities/book'
import { type Insertable, type Selectable } from 'kysely'

export function bookRepository(db: Database) {
  return {
    async create(book: Insertable<Book>): Promise<Book> {
      return db
        .insertInto('book')
        .values(book)
        .returning(bookKeys)
        .executeTakeFirstOrThrow()
    },

    async findByISBN(isbn: string): Promise<Selectable<Book> | undefined> {
      const book = await db
        .selectFrom('book')
        .select(bookKeys)
        .where('isbn', 'like', `%${isbn}%`)
        .executeTakeFirst()

      return book
    },
  }
}
