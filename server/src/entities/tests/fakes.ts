import type { User } from '@server/database/types'
import type { Insertable } from 'kysely'
import { random } from '@tests/utils/random'
import { v4 as uuidv4 } from 'uuid'
import type { AuthUser } from '../user'

const randomId = () => uuidv4()

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<Insertable<User>>>(
  overrides: T = {} as T
) => ({
  email: random.email(),
  firstName: random.firstName(),
  lastName: random.lastName(),
  password: 'Password.123!',
  ...overrides,
})

export const fakeAuthUser = <T extends Partial<AuthUser>>(
  overrides: T = {} as T
): AuthUser => ({
  id: randomId(),
  email: random.email(),
  ...overrides,
})
