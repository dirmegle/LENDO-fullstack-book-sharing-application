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
      const book =  await db
      .selectFrom('book')
      .innerJoin('bookCopy', 'book.isbn', 'bookCopy.isbn')
      .select(['book.author', 'book.categories', 'book.coverImage', 'book.description', 'book.isbn', 'book.title'])
      .where('bookCopy.id', '=', bookCopyId)
      .executeTakeFirst();
      return book;
    },
  }
}
