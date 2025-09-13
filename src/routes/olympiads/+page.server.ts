import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { subjects } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	const subjectList = await locals.db
		.select()
		.from(subjects);
	if (!subjectList) error(404);
	return {
		subjectNames: subjectList.map((subject) => subject.name)
	};
};
