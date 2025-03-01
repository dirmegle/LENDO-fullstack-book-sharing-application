import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Label } from '../Label'
import { Textarea } from '../Textarea'
import { trpc } from '@/trpc'
import { Book, CommentWithISOCreatedAt } from '@server/shared/types'
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'
import addBook from '@/utils/addBook'
import { mapISOStringSingleObject } from '@/utils/mapISOString'
import Comment from './Comment'

interface CommentSectionProps {
  book: Book
}

export default function CommentSection({ book }: CommentSectionProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [comments, setComments] = useState<CommentWithISOCreatedAt[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await trpc.comment.getCommentsByBook.query({ isbn: book.isbn })
        setComments(fetchedComments)
      } catch {
        toast({
          title: 'Could not fetch comments for the book',
          description: 'If the issue persists, please contact support',
          variant: 'destructive',
        })
      }
    }

    fetchComments()
  }, [book.isbn, toast])

  const handleCommentPosting = async () => {
    if (!textAreaRef.current) {
      return
    }

    const commentText = textAreaRef.current.value

    if (commentText.length === 0) {
      return
    }

    try {
      await addBook(book)

      const createdComment = await trpc.comment.createComment.mutate({
        isbn: book.isbn,
        content: commentText,
        public: isPublic,
      })

      textAreaRef.current.value = ""

      const createdCommentWithISOS = mapISOStringSingleObject(createdComment, ["createdAt"])

      setComments((prevComments) => [...prevComments, createdCommentWithISOS as CommentWithISOCreatedAt])

    } catch {
      toast({
        title: 'Could not post your comment',
        description: 'Try again or contact support',
        variant: 'destructive',
      })
    }
  }

  const handleCommentDeletion = (deletedCommentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== deletedCommentId)
    );
  }

  return (
    <div className="sm:w-[80%] w-[100%] mt-4">
      <h3 className="text-2xl text-center md:text-left">Comments</h3>
      <div>
        <Label htmlFor="comment">Leave your comment</Label>
        <Textarea placeholder="Type your comment here." id="comment" ref={textAreaRef} />

        <div className="flex items-center justify-end space-x-4 mt-2 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="private"
                    onCheckedChange={(checked) => setIsPublic(!!checked)}
                    checked={isPublic}
                  />
                  <label
                    htmlFor="private"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Make public
                  </label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>The comment will be visible by people outside your friend circle</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={handleCommentPosting}>Post comment</Button>
        </div>
      </div>
      <div>
      {[...comments]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((comment) => (
          <Comment key={comment.id} {...comment} onDeletion={handleCommentDeletion} />
        ))}
      </div>
    </div>
  )
}
