import { useState, useEffect } from 'react'
import { BookCopy } from '@server/shared/types'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button'
import BookCard from './BookCard'
import NoResultsMessage from './NoResultsMessage'
import bookIllustration from '@/assets/images/illustrationBook.png'

interface BooksDisplayProps {
  bookCopies: BookCopy[]
  link: string
  title: string
  noResultsMessage: string
}

export default function BooksDisplay({ bookCopies, link, title, noResultsMessage }: BooksDisplayProps) {
  const navigate = useNavigate()
  const [maxItems, setMaxItems] = useState(2) // default for smallest screens

  useEffect(() => {
    const updateMaxItems = () => {
      const width = window.innerWidth
      if (width >= 1536) {
        // 2xl and above
        setMaxItems(7)
      } else if (width >= 1280) {
        // xl
        setMaxItems(6)
      } else if (width >= 768) {
        // md
        setMaxItems(4)
      } else if (width >= 640) {
        // sm
        setMaxItems(3)
      } else {
        // default for xs
        setMaxItems(2)
      }
    }

    updateMaxItems() // set on mount
    window.addEventListener('resize', updateMaxItems)
    return () => window.removeEventListener('resize', updateMaxItems)
  }, [])

  const visibleBookCopies = bookCopies.slice(0, maxItems)

  return (
    <div>
      <div onClick={() => navigate(link)} className="flex md:flex-row flex-col justify-between">
        <h2 className="font-medium text-3xl mb-4">{title}</h2>
        <Button variant="outline">See all</Button>
      </div>
      {bookCopies.length > 0 ? (
        <div className="max-h-max border border-border p-2 shadow-[3px_3px_#141414] mt-4">
          <div className="grid 2xl:grid-cols-7 xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
            {visibleBookCopies.map((bookCopy) => (
              <div key={bookCopy.id}>
                <BookCard bookCopy={bookCopy} showOwner={false} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 border-border border shadow-[3px_3px_#141414]">
          <NoResultsMessage illustrationLink={bookIllustration} message={noResultsMessage} />
        </div>
      )}
    </div>
  )
}
