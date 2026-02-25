import { db, disconnectDb } from "../../lib/db";
import { links } from "../../db/schema";

export const cleanDatabase = async () => {
  await db.delete(links);
};

export const disconnectDatabase = async () => {
  await disconnectDb();
};
