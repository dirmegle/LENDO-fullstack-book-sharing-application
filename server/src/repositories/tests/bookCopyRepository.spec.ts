import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import {
  fakeBook,
  fakeBookCopyWithId,
  fakeUserWithId,
} from '@server/entities/tests/fakes'
import { insertAll } from '@tests/utils/records'
import { random } from '@tests/utils/random'
import { bookCopyRepository } from '../bookCopyRepository'

const db = await wrapInRollbacks(createTestDatabase())
const repository = bookCopyRepository(db)

const [book] = await insertAll(db, 'book', [fakeBook()])
const [user] = await insertAll(db, 'user', [fakeUserWithId()])

describe('create', () => {
  it('creates a book copy in the database', async () => {
    const bookCopy = fakeBookCopyWithId({
      isbn: book.isbn,
      ownerId: user.id,
    })
    const response = await repository.create(bookCopy)
    expect(response).toEqual(bookCopy)
  })
  it('throws an error for duplicating unique fields', async () => {
    const [existingBookCopy] = await insertAll(
      db,
      'bookCopy',
      fakeBookCopyWithId({
        isbn: book.isbn,
        ownerId: user.id,
      })
    )
    const newBookCopy = fakeBookCopyWithId({ isbn: existingBookCopy.isbn })
    await expect(repository.create(newBookCopy)).rejects.toThrow()
  })
})

describe('getByOwnerId', () => {
  it('returns a book copy by user id if it exists', async () => {
    const [existingBookCopy] = await insertAll(
      db,
      'bookCopy',
      fakeBookCopyWithId({
        isbn: book.isbn,
        ownerId: user.id,
      })
    )

    const [ response ] = await repository.getByOwnerId(existingBookCopy.ownerId)
    expect(response).toEqual(existingBookCopy)
  })
  it('returns undefined if there are no copies with the user id', async () => {
    const response = await repository.getByOwnerId(random.guid())
    expect(response).toEqual([])
  })
})

describe('getByISBNAndOwnerId', () => {
  it('returns a book copy if one with ISBN exists', async () => {
    const [existingBookCopy] = await insertAll(
      db,
      'bookCopy',
      fakeBookCopyWithId({
        isbn: book.isbn,
        ownerId: user.id,
      })
    )

    const response = await repository.getByISBNAndOwnerId(
      existingBookCopy.isbn,
      existingBookCopy.ownerId
    )
    expect(response).toEqual(existingBookCopy)
  })
  it('returns undefined if copy with ISBN does not exist', async () => {
    const response = await repository.getByISBNAndOwnerId(
      String(random.integer({ min: 1000000000, max: 9999999999 })),
      random.guid()
    )
    expect(response).toBeUndefined()
  })
})

describe('updateLendability', () => {
  it('toggles bool value of book copy isLendable field if bookCopy exists', async () => {
    const [existingBookCopy] = await insertAll(
      db,
      'bookCopy',
      fakeBookCopyWithId({
        isbn: book.isbn,
        ownerId: user.id,
      })
    )

    const { isLendable } = await repository.updateLendability(
      existingBookCopy.id
    )
    expect(isLendable).toBe(!existingBookCopy.isLendable)
  })
  it('throws error if bookCopy with the id does not exist', async () => {
    await expect(repository.updateLendability(random.guid())).rejects.toThrow()
  })
})

describe('updateAvailability', () => {
  it('toggles bool value of book copy isAvailable field if bookCopy exists', async () => {
    const [existingBookCopy] = await insertAll(
      db,
      'bookCopy',
      fakeBookCopyWithId({
        isbn: book.isbn,
        ownerId: user.id,
      })
    )

    const { isAvailable } = await repository.updateAvailability(
      existingBookCopy.id
    )
    expect(isAvailable).toBe(!existingBookCopy.isAvailable)
  })
  it('throws error if bookCopy with the id does not exist', async () => {
    await expect(repository.updateAvailability(random.guid())).rejects.toThrow()
  })
})
