import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, jwt, oAuthProxy } from 'better-auth/plugins';
import * as authSchema from '@repo/store/schema/auth-schema';
import type { BetterAuthOptions } from 'better-auth';
import { betterAuth } from 'better-auth';
import db from '@repo/store/client';

export function initAuth(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string;
  googleClientId: string;
  googleClientSecret: string;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        ...authSchema,
      },
    }),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24 * 30,
      },
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        /**
         * Auto-inference blocked by https://github.com/better-auth/better-auth/pull/2891
         */
        currentURL: options.baseUrl,
        productionURL: options.productionUrl,
      }),
      jwt(),
      bearer(),
    ],
    rateLimit: {
      window: 10,
      max: 10,
    },
    socialProviders: {
      google: {
        prompt: 'select_account',
        clientId: options.googleClientId,
        clientSecret: options.googleClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/google`,
      },
    },
    trustedOrigins: ['expo://'],
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth['$Infer']['Session'];
