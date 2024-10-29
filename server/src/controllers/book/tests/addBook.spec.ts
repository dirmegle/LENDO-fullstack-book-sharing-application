import { createTestDatabase } from '@tests/utils/database'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { createCallerFactory } from '@server/trpc'
import bookRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = createCallerFactory(bookRouter)
const { addBook } = createCaller({ db })

describe('addBook', () => {
  it('saves book in book and bookCopy tables', () => {})
  it('throws error if book is undefined')
})
