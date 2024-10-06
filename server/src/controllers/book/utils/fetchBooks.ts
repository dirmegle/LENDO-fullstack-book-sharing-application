import type { Book } from "@server/database/types"
import type { BookRequest } from "@server/entities/book"
import type { VolumeInfo, ReturnedBooks } from './types'

const { env } = process

const getISBN = (volumeInfo: VolumeInfo) => volumeInfo.industryIdentifier.find(i => i.type === 'ISBN_10')?.identifier ||
        volumeInfo.industryIdentifier.find(i => i.type === 'ISBN_13')?.identifier ||
        volumeInfo.industryIdentifier[0]?.identifier

const fetchData = async (url: string) => {
    try {
        const response = await fetch(url)
        return await response.json()
    } catch (error) {
        throw new Error('Failed to fetch books')
    }
}

const formulateRequest = (searchBy: string, searchValue: string) => {

    let parameter = ""

    switch (searchBy) {
        case 'author':
            parameter = 'inauthor'
            break
        case 'title':
            parameter = 'intitle'
            break
        case 'isbn':
            parameter = 'isbn'
            break
        default:
            parameter = ''
    }

    return `https://www.googleapis.com/books/v1/volumes?q=${parameter}:${searchValue.replace(' ', '+')}=&key=${env.API_KEY}`

}

const fetchBooks = async (request: BookRequest): Promise<Book[]> => {
    const [ searchBy ] = Object.keys(request)
    const [ searchValue ]  = Object.values(request)

    const url = formulateRequest(searchBy, searchValue)

    const fetchedData = await fetchData(url) as ReturnedBooks

    if (fetchedData.items.length === 0) {
        throw new Error('No books were found')
    }

    const bookList = fetchedData.items.map((item) => {
        const { volumeInfo } = item

        return {
            title: volumeInfo.title,
            author: volumeInfo.authors.join(', '),
            description: volumeInfo.description,
            categories: volumeInfo.categories.join(', '),
            coverImage: volumeInfo.imageLinks.thumbnail,
            isbn: getISBN(volumeInfo)
        };
    })

    return bookList
}

export default fetchBooks