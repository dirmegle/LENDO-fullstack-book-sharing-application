import type { Book } from '@server/database/types'
import type { BookRequest } from '@server/entities/book'
import type { VolumeInfo, ReturnedBooks } from './types'
import { fetchData } from './fetch'

const { env } = process

export const getISBN = (volumeInfo: VolumeInfo) => {
  if (!volumeInfo.industryIdentifiers) {
    return undefined
  }

  const identifiers = volumeInfo.industryIdentifiers
    .map((obj) => obj.identifier)
    .join(', ')

  return identifiers === '' ? undefined : identifiers
}

export const formulateRequest = (request: BookRequest) => {
  let parameter
  let searchValue

  if (request.author) {
    parameter = 'inauthor'
    searchValue = request.author
  } else if (request.isbn) {
    parameter = 'isbn'
    searchValue = request.isbn
  } else if (request.title) {
    parameter = 'intitle'
    searchValue = request.title
  } else if (Object.keys(request).length > 1) {
    throw new Error(
      'Request formulated incorrectly (must be one of: book, author or isbn)'
    )
  }

  return { parameter, searchValue }
}

export const getDataFromAPI = async (request: BookRequest) => {
  const { parameter, searchValue } = formulateRequest(request)

  if (!parameter || !searchValue) {
    throw new Error('No valid search parameters found in the request')
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${parameter}:${searchValue.replace(' ', '+')}&key=${env.BOOKS_API_KEY}`

  const data = (await fetchData(url)) as ReturnedBooks

  if (!data) {
    throw new Error('No books were found')
  }

  return data
}

const fetchBooks = async (request: BookRequest): Promise<Book[]> => {
  const bookData = await getDataFromAPI(request)

  const bookList = bookData.items
    .map((item) => {
      const { volumeInfo } = item

      const isbn = getISBN(volumeInfo)

      return {
        title: volumeInfo.title,
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : '',
        description: volumeInfo.description,
        categories: volumeInfo.categories
          ? volumeInfo.categories.join(', ')
          : '',
        coverImage:
          volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail
            ? volumeInfo.imageLinks.thumbnail
            : '',
        isbn,
      }
    })
    .filter((book) => book.isbn !== undefined)

  return bookList as Book[]
}

export default fetchBooks
