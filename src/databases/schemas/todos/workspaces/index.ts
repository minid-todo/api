import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { v7 } from 'uuid';
import { auditTemplate } from '../../auditTemplate';
import { accounts } from '../../users';
import { tenants } from '../tenants';

export const workspaceTypeEnum = pgEnum('workspace_types_enum', [
  'BASIC',
  'PRO',
  'BUSINESS',
]);

export const workspaceTypes = pgTable('workspace_types', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid')
    .$default(() => v7())
    .unique()
    .notNull(),
  name: varchar('name', { length: 100 }),
  description: varchar('description', { length: 255 }),
  workspace_type: workspaceTypeEnum('workspace_type'),

  conf_file_upload_size: integer('conf_file_upload_size').default(10),
  conf_project_limit: integer('conf_project_limit').default(10),
  conf_history_limit: integer('conf_history_limit').default(10),
  conf_people_limit: integer('conf_people_limit').default(10),
  ...auditTemplate,
});

export const workspaces = pgTable(
  'workspaces',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid')
      .$default(() => v7())
      .unique()
      .notNull(),
    owner_id: integer('owner_id')
      .references(() => accounts.id)
      .notNull()
      .unique(),
    name: varchar('name', { length: 100 }),
    description: varchar('description', { length: 255 }),
    tenant_id: integer('tenant_id').references(() => tenants.id).notNull(),
    is_default: boolean('is_default').notNull().default(false),
    workspace_type_id: integer('workspace_type_id')
      .references(() => workspaceTypes.id)
      .notNull(),
    ...auditTemplate,
  },
  (table) => {
    return {
      tenantsIndex: index().on(table.tenant_id),
      isDeletedIndex: index().on(table.is_deleted),
      workspaceTypeIdIndex: index().on(table.workspace_type_id),
      userIdIndex: index().on(table.owner_id),
    };
  },
);
