import { notificationTypes } from '@server/entities/notification'
import { sql, type Kysely } from 'kysely'

const mutableNotificationTypes = [...notificationTypes]

export async function up(db: Kysely<any>) {
  await db.schema
    .createType('entity_type_enum')
    .asEnum(mutableNotificationTypes)
    .execute()
  await db.schema
    .createTable('notification')
    .addColumn('id', 'uuid', (c) => c.primaryKey().notNull())
    .addColumn('user_id', 'uuid', (c) => c.references('user.id').notNull())
    .addColumn('triggered_by_id', 'uuid', (c) =>
      c.references('user.id').notNull()
    )
    .addColumn('entity_type', sql`entity_type_enum`, (c) => c.notNull())
    .addColumn('entity_id', 'uuid', (c) => c.notNull())
    .addColumn('message', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) =>
      c.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('is_read', 'boolean', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType('entity_type_enum').execute()
  await db.schema.dropTable('notification').execute()
}
