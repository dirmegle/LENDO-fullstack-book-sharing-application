import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { fakeUserWithId } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import type { BookRequest } from '@server/entities/book'
import bookRouter from '..'
import fetchBooks from '../utils/fetchBooks'

const createCaller = createCallerFactory(bookRouter)
const db = await wrapInRollbacks(createTestDatabase())
const [user] = await insertAll(db, 'user', fakeUserWithId())
const { getBooks } = createCaller(authContext({ db }, user))

const mockedBookData = {
  author: 'Jane Austen',
  title: 'Pride and prejudice',
  coverImage: 'https://www.coverimage.com',
  description: 'About pride and prejudice',
  isbn: '1234567891',
  pageCount: 150,
}

vi.mock('@server/controllers/book/utils/fetchBooks', () => ({
  default: vitest.fn().mockImplementation((request: BookRequest) => {
    const { author, title, isbn } = request

    if (
      (author && author === mockedBookData.author) ||
      (title && title === mockedBookData.title) ||
      (isbn && isbn === mockedBookData.isbn)
    ) {
      return [mockedBookData]
    }

    throw new Error('No books were found')
  }),
}))

afterAll(() => {
  vi.clearAllMocks()
})

describe('getBooks', () => {
  it('calls fetchBooks if input is correct', async () => {
    await getBooks({ title: mockedBookData.title })
    expect(fetchBooks).toHaveBeenCalledOnce()
    expect(fetchBooks).toHaveBeenCalledWith({ title: mockedBookData.title })
  })
  it('returns book data based on title', async () => {
    const result = await getBooks({ title: mockedBookData.title })
    expect(result).toEqual([mockedBookData])
  })
  it('returns book data based on author', async () => {
    const result = await getBooks({ author: mockedBookData.author })
    expect(result).toEqual([mockedBookData])
  })
  it('returns book data based on isbn', async () => {
    const result = await getBooks({ isbn: mockedBookData.isbn })
    expect(result).toEqual([mockedBookData])
  })
  it('throws an error if no book data has been found', async () => {
    await expect(getBooks({ title: 'New Book Title' })).rejects.toThrow()
  })
  it('throws an error if input contains more than one property', async () => {
    await expect(
      getBooks({
        title: mockedBookData.title,
        author: mockedBookData.author,
      })
    ).rejects.toThrow()
  })
})
