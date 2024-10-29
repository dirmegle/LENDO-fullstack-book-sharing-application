// Receive Book type input
// Add book to book table
// Add bookCopy to bookCopy table

import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(async () =>
  // eslint-disable-next-line no-console
  console.log('Hello world')
)
