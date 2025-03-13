import { trpc } from '@/trpc'
import { Book, BookCopy, User } from '@server/shared/types'
import { useEffect, useState } from 'react'
import BookCover from './BookCover'
import { useNavigate } from 'react-router-dom'
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from '@/components/Tooltip'

interface BookCardProps {
  bookCopy: BookCopy
  showOwner?: boolean
}

export default function BookCard({ bookCopy, showOwner=false }: BookCardProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [ownerProfile, setOwnerProfile] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getBooks = async () => {
      const book = await trpc.book.getBookByBookCopyId.query({ id: bookCopy.id })
      setBook(book)
    }

    const getOwnerProfile = async () => {
      const user = await trpc.user.getOwnerUserByCopyId.query({id: bookCopy.id})
      setOwnerProfile(user)
    }

    getBooks()
    getOwnerProfile()
  }, [bookCopy.id])

  return (
    book && (
      <TooltipProvider>
        <Tooltip>
        <div
        onClick={() => navigate(`/books/${book.isbn.replace(', ', '+')}`, { state: book })}
        className="cursor-pointer hover:bg-accent-peach/20 w-full h-full flex flex-col items-center p-4 transition ease-in-out duration-300"
      >
        <TooltipTrigger>
        <BookCover {...book} isLarge />
        </TooltipTrigger>
        <div className="flex flex-col mt-2 md:mt-0">
          <h3 className="text-lg font-semibold text-center line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 text-sm text-center line-clamp-1">{book.author}</p>
        </div>
      </div>
      {showOwner && <TooltipContent>{`Owned by ${ownerProfile?.firstName} ${ownerProfile?.lastName}`}</TooltipContent>}
      </Tooltip>
      </TooltipProvider>
      
    )
  )
}
