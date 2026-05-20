import { InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Link = InferSelectModel<typeof links>;

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('username').default('user').notNull(),
  email: text('email').notNull().unique(),
  hashedPassword: text('password').notNull(),
});

export type user = InferSelectModel<typeof user>;
