"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.links = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.links = (0, pg_core_1.pgTable)('links', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    url: (0, pg_core_1.text)('url').notNull(),
    shortCode: (0, pg_core_1.text)('short_code').notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.user = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('username').default('user').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    hashedPassword: (0, pg_core_1.text)('password').notNull(),
});
