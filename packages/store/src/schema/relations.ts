import { userSettings } from './user_settings';
import { UptimeCheck } from './uptime_check';

import { account } from './auth-schema';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { websites } from './website';

export const usersRelations = relations(user, ({ one, many }) => ({
  accounts: many(account),
  userSettings: one(userSettings, {
    fields: [user.id],
    references: [userSettings.userId],
  }),
  websites: many(websites),
}));

export const accountsRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}));

export const websitesRelations = relations(websites, ({ one, many }) => ({
  user: one(user, {
    fields: [websites.userId],
    references: [user.id],
  }),
}));

export const uptimeCheckRelations = relations(UptimeCheck, ({ one }) => ({
  website: one(websites, {
    fields: [UptimeCheck.websiteId],
    references: [websites.id],
  }),
}));
