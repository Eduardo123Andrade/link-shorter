import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

// Pool de conexões global
let poolGlobal: pg.Pool | undefined;

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  poolGlobal = pool;
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Desconecta o Prisma e fecha o pool de conexões
 */
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
  if (poolGlobal) {
    await poolGlobal.end();
    poolGlobal = undefined;
  }
};

export { prisma };
