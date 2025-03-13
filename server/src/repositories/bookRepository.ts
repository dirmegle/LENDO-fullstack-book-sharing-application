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

    async getBookByBookCopyId(bookCopyId: string): Promise<Book | undefined> {
      const book = await db
        .selectFrom('book')
        .innerJoin('bookCopy', 'book.isbn', 'bookCopy.isbn')
        .select([
          'book.author',
          'book.categories',
          'book.coverImage',
          'book.description',
          'book.isbn',
          'book.title',
          'book.dailyRead',
        ])
        .where('bookCopy.id', '=', bookCopyId)
        .executeTakeFirst()
      return book
    },

    async getBookByDailyRead(dateISO: string): Promise<Book | undefined> {
      return db
        .selectFrom('book')
        .select([
          'book.author',
          'book.categories',
          'book.coverImage',
          'book.description',
          'book.isbn',
          'book.title',
          'book.dailyRead',
        ])
        .where('book.dailyRead', '=', dateISO)
        .executeTakeFirst()
    },

    async getBookByISBN(isbn: string): Promise<Book | undefined> {
      return db
        .selectFrom('book')
        .select([
          'book.author',
          'book.categories',
          'book.coverImage',
          'book.description',
          'book.isbn',
          'book.title',
          'book.dailyRead',
        ])
        .where('book.isbn', '=', isbn)
        .executeTakeFirst()
    },

    async addDailyReadDate(
      dateISO: string,
      isbn: string
    ): Promise<Book | undefined> {
      return db
        .updateTable('book')
        .set({ dailyRead: dateISO })
        .where('book.isbn', '=', isbn)
        .returningAll()
        .executeTakeFirstOrThrow()
    },
  }
}
