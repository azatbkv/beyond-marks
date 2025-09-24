import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	if (locals.user.id !== env.ADMIN_USER_ID) {
		throw error(403, 'not authorized to view this page');
	}
};
