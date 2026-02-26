import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { env } from './utils/env';

const { Pool } = pg;

const run = async () => {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Running database migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations complete.');

  await pool.end();
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
