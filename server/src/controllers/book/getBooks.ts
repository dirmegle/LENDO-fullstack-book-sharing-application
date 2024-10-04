import { authenticatedProcedure } from '../../trpc/authenticatedProcedure/index'

export default authenticatedProcedure.query(() => {
  // eslint-disable-next-line no-console
  console.log('getBook')
  return 'book returned'

  // receive title, author, isbn object
  // call api with the string
  // return an array of Book
})
