import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
import { sql } from 'drizzle-orm';

export const websites = pgTable(
  'websites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    url: varchar('url', { length: 2048 }).notNull(),
    monitoringIntervalSeconds: integer('monitoring_interval_seconds').notNull().default(60),
    httpMethod: varchar('http_method', { length: 10 }).notNull().default('GET'),
    httpHeaders: jsonb('http_headers'),
    requestBody: text('request_body'),
    expectedResponseCode: integer('expected_response_code').notNull().default(200),
    expectedResponseBody: varchar('expected_response_body', { length: 500 }),
    timeoutSeconds: integer('timeout_seconds').notNull().default(10),
    isActive: boolean('is_active').notNull().default(true),
    lastCheckAt: timestamp('last_check_at', { withTimezone: true, mode: 'string' }),
    lastStatus: varchar('last_status', { length: 10 }),
    statusChangedAt: timestamp('status_changed_at', { withTimezone: true, mode: 'string' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => {
    return {
      userIdIdx: index('idx_websites_user_id').on(t.userId),
      isActiveIdx: index('idx_websites_is_active').on(t.isActive),
      userUrlIdx: uniqueIndex('idx_websites_url').on(t.url, t.userId),
    };
  },
);

export type Website = typeof websites.$inferSelect;
export type InsertWebsite = typeof websites.$inferInsert;
