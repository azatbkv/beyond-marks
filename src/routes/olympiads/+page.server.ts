import type { PageServerLoad } from './$types';
import { subjects } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const subjectNames = await locals.db
		.select({
            name: subjects.name
        })
		.from(subjects);
	return {
		subjectNames
	};
};
