import type { PageServerLoad } from './olympiads/$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};
