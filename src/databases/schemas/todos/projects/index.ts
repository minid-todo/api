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
import { workspaces } from '../workspaces';

export const projects = pgTable(
  'projects',
  {
    id: serial('id').primaryKey(),
    ...auditTemplate,
    workspace_id: integer('workspace_id')
      .references(() => workspaces.id)
      .notNull()
      .unique(),
    owner_id: integer('owner_id')
      .references(() => accounts.id)
      .notNull()
      .unique(),
    uuid: uuid('uuid')
      .$default(() => v7())
      .unique()
      .notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    is_default: boolean('is_default').notNull().default(false),
    is_archived: boolean('is_archived').notNull().default(false),
  },
  (table) => {
    return {
      isDeletedIndex: index().on(table.is_deleted),
      isDefaultIndex: index().on(table.is_default),
      isArchivedIndex: index().on(table.is_archived),
      workspaceIdIndex: index().on(table.workspace_id),
      userIdIndex: index().on(table.owner_id),
    };
  },
);
