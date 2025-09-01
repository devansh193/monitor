import { boolean, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { websites } from './websites';
import { sql } from 'drizzle-orm';

export const UptimeCheck = pgTable(
  'uptime_check',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    websiteId: uuid('website_id')
      .notNull()
      .references(() => websites.id, { onDelete: 'cascade' }),
    checkedAt: timestamp('checked_at', {
      withTimezone: true,
      mode: 'string',
    }),
    isUp: boolean('is_up').notNull(),
    httpStatusCode: integer('http_status_code'),
    responseTimeMs: integer('response_time_ms'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => {
    return {
      websiteIdCheckedIdx: index('website_id_checked_idx').on(t.checkedAt, t.websiteId),
      checkedAtIdx: index('checked_at_idx').on(t.checkedAt),
    };
  },
);
