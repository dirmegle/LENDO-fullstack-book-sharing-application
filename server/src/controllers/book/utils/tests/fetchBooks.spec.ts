import fetchBooks, { formulateRequest, getISBN } from '../fetchBooks'
import type { ReturnedBooks } from '../types'

const mockedBookData = {
  author: 'Jane Austen',
  categories: 'Fiction',
  title: 'Pride and prejudice',
  coverImage: 'https://www.coverimage.com',
  description: 'About pride and prejudice',
  isbn: '1234567891, 1234567891123',
}

const volumeInfoWithoutIdentifier = {
  title: 'Pride and prejudice',
  authors: ['Jane Austen'],
  description: 'About pride and prejudice',
  industryIdentifiers: [],
  categories: ['Fiction'],
  imageLinks: {
    smallThumbnail: 'www.link.com',
    thumbnail: 'www.link2.com',
  },
}

const volumeInfoWithIdentifier = {
  title: 'Pride and prejudice',
  authors: ['Jane Austen'],
  description: 'About pride and prejudice',
  industryIdentifiers: [
    {
      type: 'ISBN_10',
      identifier: '1234567891',
    },
    { type: 'ISBN_13', identifier: '1234567891123' },
  ],
  categories: ['Fiction'],
  imageLinks: {
    smallThumbnail: 'https://www.coverimage.com',
    thumbnail: 'https://www.coverimage.com',
  },
}

vitest.mock('../fetch', async () => ({
  ...(await vitest.importActual('../fetch')),
  fetchData: vitest.fn(
    async (): Promise<ReturnedBooks> => ({
      totalItems: 2,
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
