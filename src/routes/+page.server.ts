import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './olympiads/$types';

export const load: PageServerLoad = async ({ locals }) => {
	throw redirect(307, '/olympiads');
	return {
		user: locals.user
	};
};
