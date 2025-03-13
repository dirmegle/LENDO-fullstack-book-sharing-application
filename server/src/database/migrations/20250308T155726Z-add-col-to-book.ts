import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('book')
    .addColumn('daily_read', 'varchar')
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.alterTable('book').dropColumn('daily_read').execute()
}
