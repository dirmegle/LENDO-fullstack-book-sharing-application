import { reservationStatus } from '@server/entities/reservation'
import { sql, type Kysely } from 'kysely'

const mutableStatusTypes = [...reservationStatus]

export async function up(db: Kysely<any>) {
  await db.schema
    .createType('reservation_status_enum')
    .asEnum(mutableStatusTypes)
    .execute()

  await db.schema
    .createTable('reservation')
    .addColumn('id', 'uuid', (c) => c.primaryKey().notNull())
    .addColumn('book_copy_id', 'uuid', (c) =>
      c.references('book_copy.id').notNull()
    )
    .addColumn('status', sql`reservation_status_enum`, (c) => c.notNull())
    .addColumn('reserver_id', 'uuid', (c) => c.references('user.id').notNull())
    .addColumn('start_date', 'date', (c) => c.notNull())
    .addColumn('end_date', 'date', (c) => c.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropType('reservation_status_enum').execute()
  await db.schema.dropTable('reservation').execute()
}
