import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('comment')
    .addColumn('id', 'uuid', (c) => c.primaryKey().notNull())
    .addColumn('isbn', 'varchar', (c) => c.references('book.isbn').notNull())
    .addColumn('user_id', 'uuid', (c) => c.references('user.id').notNull())
    .addColumn('content', 'text', (c) => c.notNull())
    .addColumn('public', 'boolean', (c) => c.notNull())
    .addColumn('created_at', 'timestamp', (c) =>
      c.defaultTo(sql`NOW()`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('comment').execute()
}
