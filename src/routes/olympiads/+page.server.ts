import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { subjects } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	const subjectList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ name: subjects.name })
		.from(subjects)
		.orderBy(subjects.name)
		.all();
	if (!subjectList) error(404);
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});
	return {
		subjectNames: subjectList.map((subject) => subject.name)
	};
};
