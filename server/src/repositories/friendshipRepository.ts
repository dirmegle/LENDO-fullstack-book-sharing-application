import type { Database, Friendship, StatusEnum } from '@server/database'
import type { Selectable } from 'kysely'

export function friendshipRepository(db: Database) {
  return {
    async create(friendship: Friendship): Promise<Pick<Friendship, 'id'>> {
      return db
        .insertInto('friendship')
        .values(friendship)
        .returning('id')
        .executeTakeFirstOrThrow()
    },

    async updateStatus(id: string, newStatus: StatusEnum): Promise<Friendship> {
      return db
        .updateTable('friendship')
        .set({ status: newStatus })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async getExistingFriendship(
      userId1: string,
      userId2: string
    ): Promise<Selectable<Friendship> | undefined> {
      return db
        .selectFrom('friendship')
        .selectAll()
        .where((eb) =>
          eb.or([
            eb('fromUserId', '=', userId1).and('toUserId', '=', userId2),
            eb('fromUserId', '=', userId2).and('toUserId', '=', userId1),
          ])
        )
        .executeTakeFirst()
    },

    async findById(id: string): Promise<Selectable<Friendship> | undefined> {
      const friendship = await db
        .selectFrom('friendship')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()

      return friendship
    },
  }
}
