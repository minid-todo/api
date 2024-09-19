import {
  index,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { v7 } from 'uuid';
import { auditTemplate } from '../auditTemplate';

export const loginTypeEnum = pgEnum('login_type', [
  'EMAIL',
  'FACEBOOK',
  'GOOGLE',
  'TWITTER',
  'LINKEDIN',
  'GITHUB',
]);

export const accounts = pgTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    ...auditTemplate,
    uuid: uuid('uuid')
      .$default(() => v7())
      .notNull()
      .unique(),
    email: varchar('email', {
      length: 100,
    })
      .unique()
      .notNull(),
    password: varchar('password', {
      length: 150,
    }).notNull(),
    login_type: loginTypeEnum('login_type'),
  },
  (table) => {
    return {
      emailLoginTypeIndex: uniqueIndex().on(table.email, table.login_type),
      loginTypeIndex: index().on(table.login_type),
      isDeletedIndex: index().on(table.is_deleted),
    };
  },
);
