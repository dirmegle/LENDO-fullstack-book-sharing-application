import { router } from '@server/trpc'
import createComment from './createComment'
import updateComment from './updateComment'

export default router({ createComment, updateComment })

// createComment
// editComment
// getCommentsByBook
// deleteComment

// create
// updateText
// getByBook
// delete
