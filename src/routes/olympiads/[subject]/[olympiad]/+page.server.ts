import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { olympiads, subjects, years } from '$lib/server/db/schema';
import { and, eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders, locals, params }) => {
	// @ts-expect-error drizzle type noise
	const subject: { id: subjects.id; name: subjects.name } = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ id: subjects.id, name: subjects.name })
		.from(subjects)
		.where(eq(subjects.nameLower, params.subject))
		.get();
	// @ts-expect-error drizzle type noise
	const olympiad: { id: olympiads.id; name: olympiad.name } = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ id: olympiads.id, name: olympiads.name })
		.from(olympiads)
		.where(and(eq(olympiads.nameLower, params.olympiad), eq(olympiads.subjectId, subject.id)))
		.get();
	const yearList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ date: years.date })
		.from(years)
		.where(eq(years.olympiadId, olympiad.id))
		.orderBy(desc(years.date))
		.all();
	if (!yearList) error(404);
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});
	return {
		subjectName: subject.name,
		olympiadName: olympiad.name,
		yearDates: yearList.map((year) => year.date)
	};
};
