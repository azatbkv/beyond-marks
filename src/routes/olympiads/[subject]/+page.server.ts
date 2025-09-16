import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { olympiads, subjects } from '$lib/server/db/schema';
import { sql, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const subject = await locals.db
		.select({ id: subjects.id })
		.from(subjects)
		.where(eq(sql`lower(${subjects.name})`, params.subject));
	if (!subject) error(404);
	const subjectId = subject[0].id;
	const olympiadList = await locals.db
		.select({ name: olympiads.name })
		.from(olympiads)
		.where(eq(olympiads.subjectId, subjectId));
	if (!olympiadList) error(404);
	return {
		subjectName: params.subject,
		olympiadNames: olympiadList.map((olympiad) => olympiad.name)
	};
};
