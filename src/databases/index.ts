import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dbConfig } from '../configs';
import * as allSchemas from './schemas';

export const connection = postgres({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  idle_timeout: dbConfig.idle_timeout,
  max_lifetime: dbConfig.max_lifetime,
  connect_timeout: dbConfig.connect_timeout,
  max: dbConfig.max,
});

export const db = drizzle(connection, { schema: { ...allSchemas } });
