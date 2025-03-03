import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../Dialog'
import noCover from '@/assets/images/noCover.png'
import type { Book } from '@server/shared/types'
import { Badge } from '@/components/Badge'
import { useState } from 'react'
import { Button } from '@/components/Button'
import Add from '@/assets/icons/add.svg?react'
import CheckMark from '@/assets/icons/checkMark.svg?react'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import { useToast } from '@/hooks/useToast'
import { Separator } from '../Separator'
import useUserContext from '@/context/UserContext'

interface BookDetailsBlockProps {
  book: Book
}

export default function BookDetailsBlock({ book }: BookDetailsBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isBookAdditionDialogVisibile, setBookAdditionDialogVisibility] = useState(false)
  const [isBookRemovalDialogVisibile, setBookRemovalDialogVisibility] = useState(false)
  const { toast } = useToast()
  const { 
    checkIfBookIsInUserList, 
    addBookCopy,
    removeBookCopy 
  } = useUserContext()

  const isBookInUserList = checkIfBookIsInUserList(book.isbn)

  const categories = book.categories.split(',')

  const handleAddBookCopy = async () => {
    if (!isBookInUserList) {
      try {
        await addBookCopy(book)
        setBookAdditionDialogVisibility(false)
        toast({
          title: `${book.title} has been added to your personal library`,
          description: 'Make sure to visit your library page to disable or enable book sharing',
        })
      } catch {
        toast({
          title: 'Oops! Something went wrong',
          description: 'Could not add book to your library. Please try again or contact support.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleRemoveBookCopy = async () => {
    await removeBookCopy(book.isbn)
      setBookRemovalDialogVisibility(false)

      if (!isBookInUserList) {
        toast({
        title: `${book.title} has been removed from your personal library`,
        description: 'You can add the book any time you want.',
      })
      } else {
        toast({
          title: `Cannot remove ${book.title}`,
          description: 'This book copy might have active reservations. If the issue persists, contact support.',
          variant: 'destructive',
        })
      }
  }

  if (!book) {
    return <div>No book data available</div>
  }

  return (
    <Dialog>
      <div className="flex flex-col items-center w-full">
        <div className="lg:h-72 h-36 w-full border border-border bg-accent-green overflow-hidden"></div>
        <div className="sm:max-w-[80%] flex flex-col">
          <div className="flex md:flex-row flex-col gap-4 justify-center md:max-w-[80%] md:items-start items-center">
            <div className="md:min-h-[360px] md:min-w-[240px] h-[270px] w-[180px] -mt-12 border">
              <img
                src={book.coverImage ? book.coverImage : noCover}
                alt={`Cover image for ${book.title} by ${book.author}`}
                className="h-full w-full object-cover"
              />
              <div className="w-full flex flex-row gap-1 mt-1">
                <div className='w-full bg-primary text-background font-medium flex items-center justify-center'>{isBookInUserList ? ("In your library") : ("Not owned")}</div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <DialogTrigger>
                        <Button
                          onClick={
                            isBookInUserList
                              ? () => setBookRemovalDialogVisibility(true)
                              : () => setBookAdditionDialogVisibility(true)
                          }
                          size="icon"
                          variant={isBookInUserList ? 'accentGreen' : 'accentPurple'}
                        >
                          {isBookInUserList ? <CheckMark /> : <Add />}
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isBookInUserList ? (
                        <p>Remove from personal library</p>
                      ) : (
                        <p>Add to personal library</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex flex-col gap-1 md:items-start items-center">
              <h6 className="mt-10 md:mt-2">{book.author}</h6>
              <h3 className="text-4xl md:text-left text-center">{book.title}</h3>
              <p className="text-xs">{book.isbn}</p>
              <div className="flex gap-2 mb-4">
                {categories.map((category) => (
                  <Badge key={category}>{category}</Badge>
                ))}
              </div>
              <p className={`${!isExpanded ? 'line-clamp-4' : ''}`}>{book.description}</p>
              <Button size="text" variant="link" onClick={() => setIsExpanded((prev) => !prev)}>
                {isExpanded ? 'See less' : 'See more'}
              </Button>
            </div>
          </div>
          <Separator className="mt-16" />
        </div>
      </div>

      {isBookAdditionDialogVisibile && (
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            The book copy will be added to your personal library
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleAddBookCopy}>
              Add
            </Button>
            <Button onClick={() => setBookAdditionDialogVisibility(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      )}

      {isBookRemovalDialogVisibile && (
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            The book copy will be removed from your personal library. This action is only available
            if there are no active reservations for this book.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={handleRemoveBookCopy}>
              Remove
            </Button>
            <Button onClick={() => setBookRemovalDialogVisibility(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
