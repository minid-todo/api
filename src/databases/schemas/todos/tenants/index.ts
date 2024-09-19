import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { v7 } from 'uuid';
import { auditTemplate } from '../../auditTemplate';
import { accounts } from '../../users';

export const tenants = pgTable(
  'tenants',
  {
    id: serial('id').primaryKey(),
    ...auditTemplate,
    uuid: uuid('uuid')
      .$default(() => v7())
      .unique(),
    name: varchar('name', { length: 100 }).notNull(),
    code: varchar('code', { length: 100 }).notNull().unique(),
    owner_id: integer('owner_id')
      .references(() => accounts.id)
      .notNull()
      .unique(),
    description: varchar('description', { length: 255 }),
    is_archived: boolean('is_archived').notNull().default(false),
  },
  (table) => {
    return {
      isDeletedIndex: index().on(table.is_deleted),
      isArchivedIndex: index().on(table.is_archived),
      userIdIndex: index().on(table.owner_id),
    };
  },
);
