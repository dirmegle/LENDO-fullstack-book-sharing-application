import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeBook, fakeBookCopyWithId, fakeUserWithId } from '@server/entities/tests/fakes'
import { insertAll, selectAll } from '@tests/utils/records'
import { bookRepository } from '../bookRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = bookRepository(db)

describe('create', () => {
  it('creates book instance in the database', async () => {
    const book = fakeBook()
    const createdBook = await repository.create(book)
    expect(createdBook).toEqual(book)
  })
  it('throws an error for duplicating unique fields', async () => {
    const [existingBook] = await insertAll(db, 'book', fakeBook())
    const newBook = fakeBook({ isbn: existingBook.isbn })
    await expect(repository.create(newBook)).rejects.toThrow()
  })
})

describe('findByISBN', () => {
  it('returns book if ISBN exists', async () => {
    const [existingBook] = await insertAll(db, 'book', [fakeBook()])
    const result = await repository.findByISBN(existingBook.isbn)
    expect(result?.isbn).toEqual(existingBook.isbn)
  })
  it('returns undefined if ISBN does not exist', async () => {
    const foundBook = await repository.findByISBN('0101010101')
    expect(foundBook).toBeUndefined()
  })
})

describe('getBookByBookCopyId', () => {
  it('returns book if it exists', async () => {
    const [existingBook] = await insertAll(db, 'book', [fakeBook()])
    const [owner] = await insertAll(db, 'user', [fakeUserWithId()])
    const [existingBookCopy] = await insertAll(db, 'bookCopy', [fakeBookCopyWithId({isbn: existingBook.isbn, ownerId: owner.id})])
    const result = await repository.getBookByBookCopyId(existingBookCopy.id)
    expect(result).toEqual(existingBook)
  })
})

describe('getBookByISBN', () => {
  it('returns book if it exists', async () => {
    const [existingBook] = await insertAll(db, 'book', [fakeBook()])
    const result = await repository.getBookByISBN(existingBook.isbn)
    expect(result).toEqual(existingBook)
  })
})

describe('getBookByDailyRead', () => {
  it('returns book if it exists', async () => {
    const currentDateToISO = new Date().toISOString()
    const [existingBook] = await insertAll(db, 'book', [fakeBook({dailyRead: currentDateToISO})])

    const result = await repository.getBookByDailyRead(currentDateToISO)
    expect(result).toEqual(existingBook)
  })

  it('returns undefined if no book has the current date daily read flag', async () => {
    const currentDateToISO = new Date().toISOString()

    const result = await repository.getBookByDailyRead(currentDateToISO)
    expect(result).toBeUndefined()
  })
})

describe('addDailyReadDate', () => {
  it('updates book if it exists', async () => {
    const currentDateToISO = new Date().toISOString()

    const [existingBook] = await insertAll(db, 'book', [fakeBook({dailyRead: null})])

    await repository.addDailyReadDate(currentDateToISO, existingBook.isbn)

    const [result] = await selectAll(db, 'book', (q) => q('isbn', '=', existingBook.isbn))
    expect(result.dailyRead).toEqual(currentDateToISO)
  })
})
