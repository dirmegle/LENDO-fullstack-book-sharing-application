import type { User } from '@server/database/types'
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
