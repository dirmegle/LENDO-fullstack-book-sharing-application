import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { Label } from '../Label'
import { Textarea } from '../Textarea'
import { trpc } from '@/trpc'
import { Book } from '@server/shared/types'
import { useRef, useState } from 'react'
import { useToast } from '@/hooks/useToast'

interface CommentSectionProps {
  book: Book
}

export default function CommentSection({ book }: CommentSectionProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [isPublic, setIsPublic] = useState(false)
  const { toast } = useToast()

  const handleCommentPosting = async () => {
    if (!textAreaRef.current) {
      return
    }

    const commentText = textAreaRef.current.value

    if (commentText.length === 0) {
      return
    }

    try {
      const createdComment = await trpc.comment.createComment.mutate({
        isbn: book.isbn,
        content: commentText,
        public: isPublic,
      })

      return createdComment
    } catch {
      toast({
        title: 'Could not post your comment',
        description: 'Try again or contact support',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="sm:w-[80%] w-[100%] mt-4">
      <h3 className="text-2xl text-center md:text-left">Comments</h3>
      <div>
        <Label htmlFor="comment">Leave your comment</Label>
        <Textarea placeholder="Type your comment here." id="comment" ref={textAreaRef} />

        <div className="flex items-center justify-end space-x-4 mt-2">
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
    </div>
  )
}
