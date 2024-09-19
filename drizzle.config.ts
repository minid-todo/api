import type { Config } from "drizzle-kit";
import { dbConfig } from "./src/configs";

const path: string = "./src/databases/schemas";
const schema: string[] = [`${path}/users/index.ts`, `${path}/todos/index.ts`]; // Add your schema files here

export default {
  schema,
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env["DB_HOST"] ?? dbConfig.host,
    user: process.env["DB_USER"] ?? dbConfig.username,
    password: process.env["DB_PASSWORD"] ?? dbConfig.password,
    database: process.env["DB_NAME"] ?? dbConfig.database,
    port: Number(process.env["DB_PORT"]) ?? dbConfig.port,
  },
} satisfies Config;
