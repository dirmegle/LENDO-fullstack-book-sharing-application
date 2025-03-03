import { trpc } from '@/trpc'
import { Book, BookCopy } from '@server/shared/types'
import { useEffect, useState } from 'react'
import BookCover from './BookCover'

interface BookCardProps {
  bookCopy: BookCopy
}

export default function BookCard({ bookCopy }: BookCardProps) {
  const [book, setBook] = useState<Book | null>(null)

  useEffect(() => {
    const getBooks = async () => {
      const book = await trpc.book.getBookByBookCopyId.query({ id: bookCopy.id })
      setBook(book)
    }

    getBooks()
  }, [bookCopy.id])

  return (
    book && (
      <div className='flex flex-row w-54'>
        <BookCover {...book} />
        <div className='flex flex-col'>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
        </div>
      </div>
    )
  )
}
