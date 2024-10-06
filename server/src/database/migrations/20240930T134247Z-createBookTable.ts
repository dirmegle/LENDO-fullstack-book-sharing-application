import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('book')
    .addColumn('isbn', 'varchar', (c) => c.primaryKey().notNull())
    .addColumn('title', 'text', (c) => c.notNull())
    .addColumn('author', 'text', (c) => c.notNull())
    .addColumn('description', 'text', (c) => c.notNull())
    .addColumn('categories', 'text')
    .addColumn('cover_image', 'text')
    .execute()

  await db.schema
    .createTable('book_copy')
    .addColumn('id', 'uuid', (c) => c.primaryKey().notNull())
    .addColumn('isbn', 'varchar', (c) => c.references('book.isbn').notNull())
    .addColumn('owner_id', 'uuid', (c) => c.references('user.id').notNull())
    .addColumn('is_lendable', 'boolean', (c) => c.notNull())
    .addColumn('is_available', 'boolean', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('book').execute()
  await db.schema.dropTable('book_copy').execute()
}
