import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../db/schema';
import { env } from '../utils/env';

const { Pool } = pg;

let pool: pg.Pool | undefined;

const createDb = () => {
  pool = new Pool({ connectionString: env.DATABASE_URL });
  return drizzle(pool, { schema });
};

export const db = createDb();

export const disconnectDb = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
