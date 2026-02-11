import { disconnectPrisma } from "../../lib/prisma";

export default async () => {
  // Fecha todas as conexões do Prisma e do Pool
  await disconnectPrisma();

  // Cleanup global resources if needed
  console.log('\n🧹 Global test teardown complete\n');
};
