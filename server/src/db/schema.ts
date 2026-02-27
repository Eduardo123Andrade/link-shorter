import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const links = pgTable(
  'links',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    link: text('link').notNull(),
    shortLink: varchar('shortLink', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$default(() => new Date())
      .$onUpdate(() => new Date()),
    accessCount: integer('access_count').default(0).notNull(),
  },
  (table) => [
    uniqueIndex('links_shortLink_key').on(table.shortLink),
    index('links_shortLink_idx').on(table.shortLink),
  ],
);
