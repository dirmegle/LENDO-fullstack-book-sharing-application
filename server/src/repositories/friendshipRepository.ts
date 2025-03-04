import type { Database, Friendship, FriendshipStatusEnum } from '@server/database'
import type { Selectable } from 'kysely'

export function friendshipRepository(db: Database) {
  return {
    async create(friendship: Friendship): Promise<Friendship> {
      return db
        .insertInto('friendship')
        .values(friendship)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async updateStatus(
      id: string,
      newStatus: FriendshipStatusEnum
    ): Promise<Friendship | undefined> {
      return db
        .updateTable('friendship')
        .set({ status: newStatus })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst()
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

    async getAllFriendshipsByUser(
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

    async areAnyReservationsActive(
      userId1: string,
      userId2: string
    ): Promise<boolean> {
      const activeReservations = await db
        .selectFrom('reservation')
        .innerJoin('bookCopy', 'bookCopy.id', 'reservation.bookCopyId')
        .select(['reservation.id'])
        .where((eb) =>
          eb.or([
            eb('reservation.reserverId', '=', userId1).and(
              'bookCopy.ownerId',
              '=',
              userId2
            ),
            eb('reservation.reserverId', '=', userId2).and(
              'bookCopy.ownerId',
              '=',
              userId1
            ),
          ])
        )
        .execute()

      if (activeReservations.length > 0) {
        return true
      }

      return false
    },
  }
}
