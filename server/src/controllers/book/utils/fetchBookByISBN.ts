import { fetchData } from "./fetch"
import getISBN from "./getISBN"
import type { NYTBook, ReturnedBooks } from "./types"

const { env } = process

const fetchBookByISBN = async (bookData: NYTBook) => {
    const isbnForSearch = bookData.primary_isbn13 ? bookData.primary_isbn13 : bookData.primary_isbn10
    const isbnForSaving = getISBN(bookData)
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnForSearch}&key=${env.BOOKS_API_KEY}`
    const result = await fetchData(url) as ReturnedBooks
    const { volumeInfo } = result.items[0]

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
        isbn: isbnForSaving,
      }
}

export default fetchBookByISBN