import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as schema from '$lib/server/db/schema';
import { type DrizzleClient } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

/**
const db = env.LOCAL_DB ? createLibSqlClient(env.LOCAL_DB) : null;

if (!db) throw new Error("LOCAL_DB is not set");
if (!env.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID is not set");
if (!env.GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET is not set");
if (!env.GITHUB_CLIENT_ID) throw new Error("GITHUB_CLIENT_ID is not set");
if (!env.GITHUB_CLIENT_SECRET) throw new Error("GITHUB_CLIENT_SECRET is not set");
 
export const auth = betterAuth({
    trustedOrigins: env.TRUSTED_ORIGINS?.split(',') ?? [],
	database: drizzleAdapter(db, {
		schema,
		provider: 'sqlite',
		usePlural: true
	}),
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string
		}
	},
	session: {
   		cookieCache: {
     		enabled: true,
     		maxAge: 5 * 60, // Cache duration in seconds
   		},
  	},
});
**/

export const createAuth = function (database: DrizzleClient) {
  return betterAuth({
    trustedOrigins: env.TRUSTED_ORIGINS?.split(',') ?? [],
    database: drizzleAdapter(database, {
      schema,
      provider: 'sqlite',
      usePlural: true
    }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID as string,
        clientSecret: env.GOOGLE_CLIENT_SECRET as string
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID as string,
        clientSecret: env.GITHUB_CLIENT_SECRET as string
      }
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60 // Cache duration in seconds
      }
    },
    plugins: [sveltekitCookies(getRequestEvent)]
  });
};

export type BetterAuth = ReturnType<typeof createAuth>;
