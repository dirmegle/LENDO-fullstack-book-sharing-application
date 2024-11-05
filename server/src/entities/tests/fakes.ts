import type { Book, BookCopy, User } from '@server/database/types'
import type { Insertable } from 'kysely'
import { random } from '@tests/utils/random'
import type { AuthUser } from '../user'

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */

export const fakeUserWithoutId = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) => ({
  email: random.email(),
  firstName: random.string({ length: 10 }),
  lastName: random.string({ length: 15 }),
  password: 'Password.123!',
  ...overrides,
})

export const fakeUserWithId = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) => ({
  id: random.guid(),
  ...fakeUserWithoutId(overrides),
  ...overrides,
})

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: random.guid(),
  email: random.email(),
  ...overrides,
})

export const fakeBook = <T extends Partial<Book>>(
  overrides: T = {} as T
): Book => ({
  author: random.name(),
  categories: random.string(),
  coverImage: random.url(),
  title: random.string(),
  description: random.string(),
  isbn: String(random.integer({ min: 1000000000, max: 9999999999 })),
  ...overrides,
})

export const fakeBookCopyWithoutId = <T extends Partial<Insertable<BookCopy>>>(
  overrides: T = {} as T
) => ({
  isAvailable: random.bool(),
  isbn: String(random.integer({ min: 1000000000, max: 9999999999 })),
  isLendable: random.bool(),
  ownerId: random.guid(),
  ...overrides,
})

export const fakeBookCopyWithId = <T extends Partial<Insertable<BookCopy>>>(
  overrides: T = {} as T
) => ({
  id: random.guid(),
  ...fakeBookCopyWithoutId(overrides),
  ...overrides,
})
