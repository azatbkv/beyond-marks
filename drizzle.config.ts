import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

if (!process.env.LOCAL_DB) throw new Error('LOCAL_DB is not set');

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './src/lib/server/db/migrations',
  dialect: 'sqlite',
  dbCredentials: { url: process.env.LOCAL_DB },
  verbose: true,
  strict: true
});
