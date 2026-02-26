import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { env } from './utils/env';

const { Pool } = pg;
const MIGRATIONS_FOLDER = './drizzle';

const run = async () => {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const client = await pool.connect();

  try {
    console.log('Running database migrations...');

    // Check if __drizzle_migrations already exists
    const { rows: migTable } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = '__drizzle_migrations'
      ) AS exists
    `);

    if (!migTable[0].exists) {
      // Check if the schema was already created (e.g. by Prisma before the Drizzle migration)
      const { rows: linksTable } = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'links'
        ) AS exists
      `);

      if (linksTable[0].exists) {
        console.log('Existing schema detected — baselining Drizzle migrations...');

        await client.query(`
          CREATE TABLE "__drizzle_migrations" (
            id SERIAL PRIMARY KEY,
            hash text NOT NULL,
            created_at bigint
          )
        `);

        const journal = JSON.parse(
          fs.readFileSync(path.join(MIGRATIONS_FOLDER, 'meta', '_journal.json'), 'utf-8')
        );

        for (const entry of journal.entries) {
          const sql = fs.readFileSync(
            path.join(MIGRATIONS_FOLDER, `${entry.tag}.sql`),
            'utf-8'
          );
          const hash = crypto.createHash('sha256').update(sql).digest('hex');
          await client.query(
            `INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
            [hash, entry.when]
          );
          console.log(`Baselined: ${entry.tag}`);
        }
      }
    }

    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
    console.log('Migrations complete.');
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
