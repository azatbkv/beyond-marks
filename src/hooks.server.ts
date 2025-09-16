import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createD1Client, createLibSqlClient } from '$lib/server/db';

const db = env.DATABASE_URL ? createLibSqlClient(env.DATABASE_URL) : null;

export const handle: Handle = async ({ event, resolve }) => {
	if (db) {
		event.locals.db = db;
	} else if (event.platform?.env.DB) {
		event.locals.db = createD1Client(event.platform.env.DB);
	} else {
		throw new Error('No database found');
	}
	console.log('event.locals.db set to:', event.locals.db);

	const response = await resolve(event);
	return response;
};
