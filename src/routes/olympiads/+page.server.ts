import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { subjects } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	// @ts-expect-error drizzle type noise
	const subjectList = await locals.db.select({ name: subjects.name }).from(subjects);
	if (!subjectList) error(404);
	return {
		subjectNames: subjectList.map((subject) => subject.name)
	};
};
