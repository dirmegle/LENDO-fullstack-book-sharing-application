import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs'
import { Input } from './Input'
import React, { useRef, useState } from 'react'
import { trpc } from '@/trpc'
import type { Book } from '@server/shared/types'
import useHandleOutsideClick from '@/hooks/useHandleOutsideClick'
import BookLink from './BookLink'
import { useNavigate } from 'react-router-dom'
import Loader from '@/components/Loader/Loader'

export default function BookSearch() {
  const [activeTab, setActiveTab] = useState('author')
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const resultsWindowRef = useRef(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  const placeholder = `Search books by ${activeTab}`

  const searchBooks = async (searchBy: string, query: string) => {
    let searchQuery = {}

    if (searchBy === 'author') {
      searchQuery = { author: query }
    } else if (searchBy === 'title') {
      searchQuery = { title: query }
    } else if (searchBy === 'isbn') {
      searchQuery = { isbn: query }
    }

    return await trpc.book.fetchBooksFromAPI.query(searchQuery)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>
  ) => {
    let inputValue: string

    if ('clipboardData' in e) {
      inputValue = e.clipboardData.getData('text')
    } else {
      inputValue = e.target.value
    }

    setSearchValue(inputValue)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (inputValue === '') {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const books = await searchBooks(activeTab, inputValue)
        setResults(books)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  const handleBookLinkClick = (book: Book) => {
    setSearchValue('')
    setResults([])
    navigate(`/books/${book.isbn.replace(', ', '+')}`, { state: book })
  }

  useHandleOutsideClick(resultsWindowRef.current, () => setResults([]))

  return (
    <div className="flex md:flex-row gap-2 flex-col-reverse">
      <div className="relative md:w-72 w-full">
        <Input value={searchValue} placeholder={placeholder} onChange={handleInputChange} />
        {searchValue !== '' && (isLoading || results.length > 0) && (
          <div
            className="p-2 absolute top-full left-0 w-full z-20 bg-background max-h-60 overflow-auto border border-t-0 border-border"
            ref={resultsWindowRef}
          >
            {isLoading && <Loader />}
            {results.length > 0 &&
              results.map((book: Book) => (
                <BookLink
                  key={book.isbn}
                  onClick={() => handleBookLinkClick(book)}
                  {...book}
                />
              ))}
          </div>
        )}
      </div>
      <div className="md:w-56 w-full">
        <Tabs value={activeTab} onValueChange={(newValue) => setActiveTab(newValue)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="author">Author</TabsTrigger>
            <TabsTrigger value="title">Title</TabsTrigger>
            <TabsTrigger value="isbn">ISBN</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
