import { sql } from 'drizzle-orm';
import { db } from '../lib/db';

const checkDatabase = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    return false;
  }
};

export const CheckDatabaseRepository = {
  checkDatabase,
};
