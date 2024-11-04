import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { fakeBook } from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
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
    expect(result).toEqual(existingBook)
  })
  it('returns undefined if ISBN does not exist', async () => {
    const foundBook = await repository.findByISBN('0101010101')
    expect(foundBook).toBeUndefined()
  })
})
