import type { NYTBook } from "./types"

const getISBN = (book: NYTBook) => {
    if (!book.primary_isbn10 && book.primary_isbn13) {
        return `${book.primary_isbn13}`
    }  
    if (book.primary_isbn10 && !book.primary_isbn13) {
        return `${book.primary_isbn10}`
    } 
    return `${book.primary_isbn13}, ${book.primary_isbn10}`
}

export default getISBN