import {
  integer,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const mimeTypes = pgTable('mime_types', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  hashName: varchar('hash_name', { length: 32 }).notNull(),
});

export const consumes = pgTable('consume', {
  apisId: integer('apis_id'),
  mimeTypesId: integer('mime_type_id'),
});

export const produces = pgTable('produces', {
  apisId: integer('apis_id'),
  mimeTypesId: integer('mime_type_id'),
});

export const paths = pgTable('paths', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  hashName: varchar('hash_name', { length: 32 }).notNull(),
});

export const apis = pgTable('apis', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  version: varchar('name', { length: 10 }).default('1.0.0').notNull(),
  description: text('description'),
  basePath: varchar('base_path', { length: 255 }).default('/'),
});

export const apisPathMp = pgTable('api_path_mp', {});
