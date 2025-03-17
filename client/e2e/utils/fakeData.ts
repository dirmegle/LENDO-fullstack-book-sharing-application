import type { Insertable } from 'kysely'
import { User} from '../../../server/src/shared/types'
import { Chance } from 'chance'

export const random = process.env.CI ? Chance(1) : Chance()

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
