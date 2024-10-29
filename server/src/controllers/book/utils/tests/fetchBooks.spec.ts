import { fakeBook } from '@server/entities/tests/fakes'
import fetchBooks, { formulateRequest, getISBN } from '../fetchBooks'
import type { ReturnedBooks } from '../types'

const mockedBookData = fakeBook()

// const mockedBookData = {
//   author: 'Jane Austen',
//   categories: 'Fiction',
//   title: 'Pride and prejudice',
//   coverImage: 'https://www.coverimage.com',
//   description: 'About pride and prejudice',
//   isbn: '1234567891, 1234567891123',
// }

const volumeInfoWithoutIdentifier = {
  title: mockedBookData.title,
  authors: [mockedBookData.author],
  description: mockedBookData.description,
  industryIdentifiers: [],
  categories: [mockedBookData.categories],
  imageLinks: {
    smallThumbnail: mockedBookData.coverImage,
    thumbnail: mockedBookData.coverImage,
  },
}

const volumeInfoWithIdentifier = {
  title: mockedBookData.title,
  authors: [mockedBookData.author],
  description: mockedBookData.description,
  industryIdentifiers: [
    {
      type: 'ISBN_10',
      identifier: mockedBookData.isbn,
    },
  ],
  categories: [mockedBookData.categories],
  imageLinks: {
    smallThumbnail: mockedBookData.coverImage,
    thumbnail: mockedBookData.coverImage,
  },
}

vitest.mock('../fetch', async () => ({
  ...(await vitest.importActual('../fetch')),
  fetchData: vitest.fn(
    async (): Promise<ReturnedBooks> => ({
      totalItems: 1,
      items: [{ volumeInfo: volumeInfoWithIdentifier }],
    })
  ),
}))

describe('getISBN', () => {
  it('returns ISBN numbers in a string if they are found', () => {
    const result = getISBN(volumeInfoWithIdentifier)

    expect(result).toEqual(
      volumeInfoWithIdentifier.industryIdentifiers
        .map((obj) => obj.identifier)
        .join(', ')
    )
  })
  it('returns undefined if no ISBN or other identifier is found', () => {
    const result = getISBN(volumeInfoWithoutIdentifier)

    expect(result).toBeUndefined()
  })
})

describe('formulateRequest', () => {
  const parameters = {
    author: 'inauthor',
    isbn: 'isbn',
    title: 'intitle',
  }

  it('returns correct parameter and search value for request of author', () => {
    const request = { author: mockedBookData.author }
    const { parameter, searchValue } = formulateRequest(request)
    expect(parameter).toEqual(parameters.author)
    expect(searchValue).toEqual(mockedBookData.author)
  })
  it('returns correct parameter and search value for request of isbn', () => {
    const request = { isbn: mockedBookData.isbn }
    const { parameter, searchValue } = formulateRequest(request)
    expect(parameter).toEqual(parameters.isbn)
    expect(searchValue).toEqual(mockedBookData.isbn)
  })
  it('returns correct parameter and search value for request of title', () => {
    const request = { title: mockedBookData.title }
    const { parameter, searchValue } = formulateRequest(request)
    expect(parameter).toEqual(parameters.title)
    expect(searchValue).toEqual(mockedBookData.title)
  })
})

describe('fetchBooks', () => {
  const request = { author: 'Jane Austen' }

  it('formats returned data correctly', async () => {
    const result = await fetchBooks(request)
    expect(result).toEqual([mockedBookData])
  })
})
