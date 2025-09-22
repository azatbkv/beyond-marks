import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { olympiads, subjects } from '$lib/server/db/schema';
import { and, sql, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const olympiadList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ name: olympiads.name })
		.from(olympiads)
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(and(eq(sql`lower(${subjects.name})`, params.subject)));
	if (!olympiadList) error(404);
	return {
		subjectName: params.subject,
		// @ts-expect-error wrong expected object
		olympiadNames: olympiadList.map((olympiad) => olympiad.name)
	};
};
