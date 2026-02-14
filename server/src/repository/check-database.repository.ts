import { prisma } from '../lib/prisma';

const checkDatabase = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

export const CheckDatabaseRepository = {
  checkDatabase,
};
