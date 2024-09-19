import {
  boolean,
  date,
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
import { projects } from '../projects';

export const todos = pgTable(
  'todos',
  {
    id: serial('id').primaryKey(),
    ...auditTemplate,
    project_id: integer('project_id')
      .references(() => projects.id)
      .notNull(),
    uuid: uuid('uuid')
      .$default(() => v7())
      .unique()
      .notNull(),
    owner_id: integer('owner_id')
      .references(() => accounts.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    priority: integer('priority').notNull().default(4),
    start_date: date('start_date').defaultNow(),
    end_date: date('end_date'),
    is_completed: boolean('is_completed').default(false),
  },
  (table) => {
    return {
      isDeletedIndex: index().on(table.is_deleted),
      projectIdIndex: index().on(table.project_id),
      isCompleteIndex: index().on(table.is_completed),
      startDateIndex: index().on(table.start_date),
      endDateIndex: index().on(table.end_date),
      accountIdIndex: index().on(table.owner_id),
      priorityIndex: index().on(table.priority),
    };
  },
);

export const subTodos = pgTable(
  'sub_todos',
  {
    id: serial('id').primaryKey(),
    ...auditTemplate,
    todos_id: integer('todos_id')
      .references(() => todos.id)
      .notNull(),
    uuid: uuid('uuid')
      .$default(() => v7())
      .unique()
      .notNull(),
    owner_id: integer('owner_id')
      .references(() => accounts.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }),
    priority: integer('priority').notNull().default(4),
    start_date: date('start_date').defaultNow(),
    end_date: date('end_date'),
    is_completed: boolean('is_completed').default(false),
  },
  (table) => {
    return {
      isDeletedIndex: index().on(table.is_deleted),
      todoIdIndex: index().on(table.todos_id),
      isCompleteIndex: index().on(table.is_completed),
      startDateIndex: index().on(table.start_date),
      endDateIndex: index().on(table.end_date),
      accountIdIndex: index().on(table.owner_id),
      priorityIndex: index().on(table.priority),
    };
  },
);
