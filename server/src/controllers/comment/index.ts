import { router } from '@server/trpc'
import createComment from './createComment'
import updateComment from './updateComment'
import getCommentsByBook from './getCommentsByBook'
import deleteComment from './deleteComment'

export default router({ createComment, updateComment, getCommentsByBook, deleteComment })
