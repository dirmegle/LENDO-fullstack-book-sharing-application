import type { Database } from '@server/database'
import type { Friendship, User } from '@server/database/types'
import {
  type UserPublic,
  userKeysAll,
  userKeysPublic,
} from '@server/entities/user'
import { sql, type Insertable, type Selectable } from 'kysely'

export type UserWithFriendship = {
  userId: User['id']
  friendshipId: Friendship['id']
} & Omit<User, 'id' | 'password'> &
  Omit<Friendship, 'id'>

export function userRepository(db: Database) {
  return {
    async create(user: Insertable<User>): Promise<UserPublic> {
      return db
        .insertInto('user')
        .values(user)
        .returning(userKeysPublic)
        .executeTakeFirstOrThrow()
    },

    async findByEmail(email: string): Promise<Selectable<User> | undefined> {
      const user = await db
        .selectFrom('user')
        .select(userKeysAll)
        .where('email', '=', email)
        .executeTakeFirst()

      return user
    },

    async findByBookCopyId(
      bookCopyId: string
    ): Promise<Selectable<User> | undefined> {
      return db
        .selectFrom('user')
        .selectAll('user')
        .innerJoin('bookCopy', 'bookCopy.ownerId', 'user.id')
        .where('bookCopy.id', '=', bookCopyId)
        .executeTakeFirst()
    },

    async findByUserId(id: string): Promise<Selectable<User> | undefined> {
      const user = await db
        .selectFrom('user')
        .select(userKeysAll)
        .where('id', '=', id)
        .executeTakeFirst()

      return user
    },

    async getUserFriendsByUser(userId: string): Promise<UserWithFriendship[]> {
      return db
        .selectFrom('friendship')
        .where((eb) =>
          eb.or([
            eb('friendship.fromUserId', '=', userId),
            eb('friendship.toUserId', '=', userId),
          ])
        )
        .innerJoin('user', (join) =>
          join.on((eb) =>
            eb.or([
              eb.and([
                eb('friendship.fromUserId', '=', userId),
                eb('user.id', '=', eb.ref('friendship.toUserId')),
              ]),
              eb.and([
                eb('friendship.toUserId', '=', userId),
                eb('user.id', '=', eb.ref('friendship.fromUserId')),
              ]),
            ])
          )
        )
        .select([
          'user.id as userId',
          'user.email',
          'user.firstName',
          'user.lastName',
          'friendship.id as friendshipId',
          'friendship.toUserId',
          'friendship.fromUserId',
          'friendship.status',
        ])
        .execute()
    },

    async searchUserByName(name: string): Promise<User[]> {
      return db
        .selectFrom('user')
        .where((eb) =>
          eb(
            sql<string>`concat(${eb.ref('user.firstName')}, ' ', ${eb.ref('user.lastName')})`,
            'like',
            `%${name}%`
          )
        )
        .selectAll()
        .execute();
    },

    async updateEmail(newEmail: string, id: string): Promise<User | undefined> {
      return db
        .updateTable('user')
        .set({ email: newEmail })
        .where('user.id', '=', id)
        .returningAll()
        .executeTakeFirst()
    },
  }
}
