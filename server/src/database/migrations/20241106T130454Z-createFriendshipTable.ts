import { friendshipStatus } from '@server/entities/friendship'
import { sql, type Kysely } from 'kysely'

const friendshipStatusMutable = [...friendshipStatus]

export async function up(db: Kysely<any>) {
  await db.schema
    .createType('friendship_status_enum')
    .asEnum(friendshipStatusMutable)
    .execute()

  await db.schema
    .createTable('friendship')
    .addColumn('id', 'uuid', (c) => c.primaryKey().notNull())
    .addColumn('from_user_id', 'uuid', (c) => c.references('user.id').notNull())
    .addColumn('to_user_id', 'uuid', (c) => c.references('user.id').notNull())
    .addColumn('status', sql`friendship_status_enum`, (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType('friendship_status_enum').execute()
  await db.schema.dropTable('friendship').execute()
}
