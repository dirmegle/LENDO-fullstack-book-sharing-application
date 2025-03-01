import { trpc } from '@/trpc'
import type { CommentWithISOCreatedAt, User } from '@server/shared/types'
import { useEffect, useState } from 'react'
import UserProfilePic from '@/assets/icons/userProfilePic.svg?react'
import useUserContext from '@/context/UserContext'
import { Button } from '../Button'
import Edit from '@/assets/icons/edit.svg?react'
import Delete from '@/assets/icons/delete.svg?react'
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { Textarea } from '../Textarea'
import { DialogContent, DialogDescription, DialogFooter, DialogTitle } from '../Dialog'
import { useToast } from '@/hooks/useToast'
import { formatDateWithTime } from '@/utils/formatDate'

type CommentProps = Pick<CommentWithISOCreatedAt, 'id' | 'content' | 'createdAt' | 'userId'> & {
  onDeletion: (id: CommentWithISOCreatedAt['id']) => void
}

export default function Comment({ id, content, createdAt, userId, onDeletion }: CommentProps) {
  const [commentAuthor, setCommentAuthor] = useState<User | null>(null)
  const { user } = useUserContext()
  const [isEditing, setEditing] = useState(false)
  const [commentContent, setCommentContent] = useState(content)
  const [editedContent, setEditedContent] = useState(content)
  const [isDialogVisible, setDialogVisibility] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await trpc.user.getUserById.query({ id: userId })
        setCommentAuthor(fetchedUser)
      } catch (e) {
        console.error(e)
      }
    }
    fetchUser()
  }, [userId])

  const isAuthUserAuthor = user?.id === commentAuthor?.id

  const handleSaveChanges = async () => {
    if (!editedContent.trim()) return
    try {
      const updatedComment = await trpc.comment.updateComment.mutate({id: id, content: editedContent})
      setCommentContent(updatedComment.content ?? "")
      setEditing(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedContent(commentContent)
      setEditing(false)
    } else {
      setEditedContent(commentContent)
      setEditing(true)
    }
  }

  const handleCommentDeletion = async () => {
    try {
      await trpc.comment.deleteComment.mutate({id: id})
      onDeletion(id)
      setDialogVisibility(false)
    } catch {
      toast({
        title: 'Could not delete comment',
        description: 'If the issue persists, please contact support',
        variant: 'destructive',
      })
    }
  }

  return (
    commentAuthor && (
      <Dialog>
        <div className="flex flex-col border border-border mb-4 p-2">
          <div className="flex flex-row items-center">
            <div className="border border-border w-12 h-12 bg-accent-purple">
              <UserProfilePic className="w-full h-full" />
            </div>
            <div className="text-primary ml-2">
              <h6 className="font-medium">
                {`${commentAuthor.firstName} ${commentAuthor.lastName}`}
              </h6>
              <p className="text-xs">{formatDateWithTime(createdAt)}</p>
            </div>
          </div>
          <div className="mt-2">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              commentContent
            )}
          </div>
          {isAuthUserAuthor && (
            <div className="flex flex-row justify-end mt-2">
              {isEditing && (
                <Button size="xsm" variant="outline" onClick={handleSaveChanges}>
                  Save changes
                </Button>
              )}
              <Button
                size="smallIcon"
                variant="outline"
                className="mx-1"
                onClick={handleEditToggle}
              >
                <Edit />
              </Button>
              <DialogTrigger>
                <Button size="smallIcon" variant="outline" onClick={() => setDialogVisibility(true)}>
                  <Delete />
                </Button>
              </DialogTrigger>
            </div>
          )}
        </div>
        {isDialogVisible && (
          <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone</DialogDescription>
          <DialogFooter>
          <Button variant="destructive" onClick={handleCommentDeletion}>Delete</Button>
          <Button onClick={() => setDialogVisibility(false)}>Cancel</Button>
        </DialogFooter>
        </DialogContent>
        )}
      </Dialog>
    )
  )
}
