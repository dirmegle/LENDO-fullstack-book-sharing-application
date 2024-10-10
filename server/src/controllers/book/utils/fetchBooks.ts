import type { Book } from '@server/database/types'
import type { BookRequest } from '@server/entities/book'
import type { VolumeInfo, ReturnedBooks } from './types'

const { env } = process

const getISBN = (volumeInfo: VolumeInfo) => {
  if (!volumeInfo.industryIdentifiers) {
    return undefined
  }

  return volumeInfo.industryIdentifiers.map((obj) => obj.identifier).join(', ')
}

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    throw new Error('Failed to fetch books')
  }
}

const getDataFromAPI = async (request: BookRequest) => {
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
  }

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
