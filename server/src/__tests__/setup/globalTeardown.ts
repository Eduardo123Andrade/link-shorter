import path from 'path';
import dotenv from 'dotenv';

export default async () => {
  // globalTeardown roda num processo separado sem as env vars dos workers.
  // É necessário carregá-las antes de importar db.ts (que valida env ao ser carregado).
  dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

  const { disconnectDb } = await import('../../lib/db');
  await disconnectDb();

  console.log('\n🧹 Global test teardown complete\n');
};
