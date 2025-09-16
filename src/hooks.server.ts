import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createD1Client, createLibSqlClient } from '$lib/server/db';

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

	if (event.url.pathname.startsWith('/seed')) throw redirect(302, '/');
	const response = await resolve(event);
	return response;
};
