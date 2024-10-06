import { z } from 'zod'
import { authenticatedProcedure } from '../../trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .input(z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  }))
  .query(({input, ctx: { repos }}) => {

  })
