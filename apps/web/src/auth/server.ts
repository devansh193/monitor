import { initAuth } from '@repo/auth/index';
import { headers } from 'next/headers';
import { cache } from 'react';

const auth = initAuth({
  baseUrl: process.env.BETTER_AUTH_URL!,
  productionUrl: process.env.PRODUCTION_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  googleClientId: process.env.AUTH_GOOGLE_ID!,
  googleClientSecret: process.env.AUTH_GOOGLE_SECRET!,
});

export default auth;
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));
