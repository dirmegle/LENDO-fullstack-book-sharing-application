import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', (c) => c.primaryKey().notNull())
    .addColumn('username', 'text', (c) => c.unique().notNull())
    .addColumn('email', 'text', (c) => c.unique().notNull())
    .addColumn('password', 'text', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user').execute()
}
