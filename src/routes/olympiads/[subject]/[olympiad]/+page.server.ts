import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { olympiads, subjects, years } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders, locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	const yearList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ date: years.date })
		.from(years)
		.innerJoin(olympiads, eq(years.olympiadId, olympiads.id))
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(and(eq(subjects.nameLower, params.subject), eq(olympiads.nameLower, params.olympiad)))
		.orderBy(years.date)
		.all();
	if (!yearList) error(404);
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});
	return {
		subjectName: params.subject,
		olympiadName: params.olympiad,
		// @ts-expect-error wrong expected object
		yearDates: yearList.map((year) => year.date)
	};
};
