import { prisma, disconnectPrisma } from "../../lib/prisma";

/**
 * Limpa todas as tabelas do banco de dados de teste
 */
export const cleanDatabase = async () => {
  await prisma.linkAccess.deleteMany();
  await prisma.link.deleteMany();
};

/**
 * Fecha a conexão com o banco de dados
 */
export const disconnectDatabase = async () => {
  await disconnectPrisma();
};
