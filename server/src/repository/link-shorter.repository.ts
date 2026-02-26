import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../lib/db';
import { links } from '../db/schema';
import { ICreateLinkInput } from '../interfaces';
import { LinkNotFoundError } from '../errors';

type Link = typeof links.$inferSelect;

const save = async (linkData: ICreateLinkInput) => {
  const [savedLink] = await db
    .insert(links)
    .values({
      id: linkData.id,
      link: linkData.link,
      shortLink: linkData.shortLink,
    })
    .returning();
  return savedLink;
};

const findById = async (id: string) => {
  const [link] = await db.select().from(links).where(eq(links.id, id));

  if (!link) {
    throw new LinkNotFoundError();
  }

  return link;
};

const findByShortLink = async (shortLink: string): Promise<Link | null> => {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortLink, shortLink));
  return link ?? null;
};

const listAll = async () => {
  return db.select().from(links).orderBy(desc(links.createdAt));
};

const deleteById = async (id: string) => {
  await findById(id);

  const [deletedLink] = await db
    .delete(links)
    .where(eq(links.id, id))
    .returning();
  return deletedLink;
};

const incrementAccess = async (id: string) => {
  await findById(id);

  const [updatedLink] = await db
    .update(links)
    .set({ accessCount: sql`${links.accessCount} + 1` })
    .where(eq(links.id, id))
    .returning();
  return updatedLink;
};

export const LinkShorterRepository = {
  save,
  findById,
  findByShortLink,
  listAll,
  deleteById,
  incrementAccess,
};
