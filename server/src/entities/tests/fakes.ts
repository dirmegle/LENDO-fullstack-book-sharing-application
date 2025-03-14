import type {
  Book,
  BookCopy,
  Comment,
  EntityTypeEnum,
  Friendship,
  Notification,
  ReservationStatusEnum,
  FriendshipStatusEnum,
  User,
} from '@server/database/types'
import type { Insertable } from 'kysely'
import { random } from '@tests/utils/random'
import type { AuthUser } from '../user'
import type { ReservationWithISOString } from '../reservation'

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
  dailyRead: null,
  ...overrides,
})

export const fakeBookCopyWithoutId = <T extends Partial<Insertable<BookCopy>>>(
  overrides: T = {} as T
) => ({
  isAvailable: true,
  isbn: String(random.integer({ min: 1000000000, max: 9999999999 })),
  isLendable: true,
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

export const fakeFriendshipWithoutId = <
  T extends Partial<Insertable<Friendship>>,
>(
  overrides: T = {} as T
) => ({
  fromUserId: random.guid(),
  toUserId: random.guid(),
  status: 'pending' as FriendshipStatusEnum,
  ...overrides,
})

export const fakeFriendshipWithId = <T extends Partial<Insertable<Friendship>>>(
  overrides: T = {} as T
) => ({
  id: random.guid(),
  ...fakeFriendshipWithoutId(overrides),
  ...overrides,
})

export const fakeNotificationWithoutId = <
  T extends Partial<Insertable<Notification>>,
>(
  overrides: T = {} as T
) => ({
  entityId: random.guid(),
  entityType: 'friendship' as EntityTypeEnum,
  isRead: random.bool(),
  message: random.sentence(),
  triggeredById: random.guid(),
  userId: random.guid(),
  ...overrides,
})

export const fakeNotificationWithId = <
  T extends Partial<Insertable<Notification>>,
>(
  overrides: T = {} as T
) => ({
  id: random.guid(),
  ...fakeNotificationWithoutId(),
  ...overrides,
})

export const fakeReservationWithoutId = <
  T extends Partial<ReservationWithISOString>,
>(
  overrides: T = {} as T
) => ({
  bookCopyId: random.guid(),
  reserverId: random.guid(),
  status: 'pending' as ReservationStatusEnum,
  startDate: new Date('2025-11-06').toISOString(),
  endDate: new Date('2025-12-16').toISOString(),
  ...overrides,
})

export const fakeReservationWithId = <
  T extends Partial<ReservationWithISOString>,
>(
  overrides: T = {} as T
) => ({
  id: random.guid(),
  ...fakeReservationWithoutId(),
  ...overrides,
})

export const fakeCommentWithoutId = <T extends Partial<Insertable<Comment>>>(
  overrides: T = {} as T
) => ({
  isbn: String(random.integer({ min: 1000000000, max: 9999999999 })),
  userId: random.guid(),
  content: random.string(),
  public: random.bool(),
  ...overrides,
})

export const fakeCommentWithId = <T extends Partial<Comment>>(
  overrides: T = {} as T
) => ({
  id: random.guid(),
  ...fakeCommentWithoutId(),
  ...overrides,
})
