import type { Database } from '@server/database'
import type { User } from '@server/database/types'
import {
  type UserPublic,
  userKeysAll,
  userKeysPublic,
} from '@server/entities/user'
import type { Insertable, Selectable } from 'kysely'

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

    async findByBookCopyId(bookCopyId: string): Promise<Selectable<User> | undefined> {
      return db
        .selectFrom('user')
        .selectAll()
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

    async updateEmail(newEmail: string, id: string): Promise<User | undefined> {
      return db.updateTable('user').set({email: newEmail}).where('user.id', '=', id).returningAll().executeTakeFirst()
    }
  }
}
