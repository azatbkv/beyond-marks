import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './olympiads/$types';

export const load: PageServerLoad = async ({ locals }) => {
	throw redirect(302, "/olympiads");
	return {
		user: locals.user
	};
};
