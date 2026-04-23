import { InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Link = InferSelectModel<typeof links>;
