import {
  jsonb,
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql';
import { websites } from './websites';

export const httpsMonitorConfigs = pgTable(
  'https_monitor_configs',
  {
    monitorId: uuid('monitor_id')
      .notNull()
      .references(() => websites.id, { onDelete: 'cascade' }),

    httpMethod: varchar('http_method', { length: 10 }).notNull().default('GET'),
    httpHeaders: jsonb('http_headers'),
    requestBody: text('request_body'),

    expectedResponseCode: integer('expected_response_code').default(200),
    expectedResponseBody: varchar('expected_response_body', { length: 500 }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    monitorIdIdx: index('idx_https_configs_monitor_id').on(t.monitorId),
  }),
);

export type HttpsMonitorConfig = typeof httpsMonitorConfigs.$inferSelect;
export type InsertHttpsMonitorConfig = typeof httpsMonitorConfigs.$inferInsert;
