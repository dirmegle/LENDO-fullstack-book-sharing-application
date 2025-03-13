import { BookCopy } from "@server/shared/types"
import { useNavigate } from "react-router-dom"
import { Button } from "./Button"
import BookCard from "./BookCard"

interface BooksDisplayProps {
    bookCopies: BookCopy[]
    link: string
    title: string
}

export default function BooksDisplay({bookCopies, link, title}: BooksDisplayProps) {
    const navigate = useNavigate()
    
  return (
    <div>
    <div
      onClick={() => navigate(link)}
      className="flex flex-row justify-between"
    >
      <h2 className="font-medium text-3xl mb-4">{title}</h2>
      <Button variant="outline">See all</Button>
    </div>
    <div className="lg:overflow-hidden overflow-y-auto  lg:h-max-content h-[275px] border border-border p-2">
      <div className="grid 2xl:grid-cols-7 xl:grid-cols-6  md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-2">
        {bookCopies.map((bookCopy) => (
          <div key={bookCopy.id}>
            <BookCard bookCopy={bookCopy} showOwner={false} />
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}
