import { createCallerFactory } from '@server/trpc'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createTestDatabase } from '@tests/utils/database'
import bookRouter from '..'

const createCaller = createCallerFactory(bookRouter)
const db = await wrapInRollbacks(createTestDatabase())
const { getBooks } = createCaller({ db })

const mockedBookData = {
    author: "Jane Austen",
    title: "Pride and prejudice",
    coverImage: "https://www.coverimage.com",
    description: "About pride and prejudice",
    isbn: "1234567891",
    pageCount: 150,
}

vi.mock('@server/controllers/book/utils/fetchBooks', () => ({
    fetchBooks: vitest.fn().mockReturnValue(mockedBookData)
}))

afterAll(() => {
    vi.clearAllMocks()
  })

describe('getBooks', () => {
    it('returns book data based on title', async () => {
        const result = await getBooks({ title: mockedBookData.title})
        expect(result).toEqual([mockedBookData])
    })
    it('returns book data based on author', async () => {
        const result = await getBooks({ author: mockedBookData.author})
        expect(result).toEqual([mockedBookData])
    })
    it('returns book data based on isbn', async () => {
        const result = await getBooks({ isbn: mockedBookData.isbn})
        expect(result).toEqual([mockedBookData])
    })
    it('throws an error if no book data has been found', async () => {
        await expect(getBooks({ title: "New Book Title"})).rejects.toThrow()
    })
})