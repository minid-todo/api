export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'main',
  username: process.env.DB_USER || 'main',
  password: process.env.DB_PASS || 'minid-todo',
  max: Number(process.env.DB_CONNECTION_MAX) || 20,
  idle_timeout: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
  max_lifetime: Number(process.env.DB_MAX_LIFETIME) || 2000,
  connect_timeout: Number(process.env.DB_CONNECT_TIMEOUT) || 10,
};
