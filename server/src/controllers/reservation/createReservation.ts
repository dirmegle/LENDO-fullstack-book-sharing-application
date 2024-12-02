import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.mutation(() => {
  console.log('create')
  // receive reservation object
  // check if reservation dates do not overlap with existing dates
  // if not, create reservation
  // create notification
})
