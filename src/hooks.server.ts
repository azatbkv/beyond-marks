import { type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createD1Client, createLibSqlClient } from '$lib/server/db';
import { createAuth } from './auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
  if (dev && env.LOCAL_DB) {
    // use local.db on "run dev"
    event.locals.db = createLibSqlClient(env.LOCAL_DB);
  } else if (event.platform?.env.DB) {
    // use d1 on "run preview" and "run deploy"
    event.locals.db = createD1Client(event.platform.env.DB);
  } else {
    throw new Error('No database found');
  }

  const auth = createAuth(event.locals.db);
  event.locals.auth = auth;

  const session = await auth.api.getSession({
    headers: event.request.headers
  });
  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  return svelteKitHandler({ auth, event, resolve, building });
};
