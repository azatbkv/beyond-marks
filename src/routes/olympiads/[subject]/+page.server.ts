import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { olympiads, subjects } from '$lib/server/db/schema';
import { and, sql, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders, locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	const olympiadList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ name: olympiads.name })
		.from(olympiads)
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(and(eq(sql`lower(${subjects.name})`, params.subject)));
	if (!olympiadList) error(404);
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});
	return {
		subjectName: params.subject,
		// @ts-expect-error wrong expected object
		olympiadNames: olympiadList.map((olympiad) => olympiad.name)
	};
};
