import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { olympiads, subjects, years } from '$lib/server/db/schema';
import { sql, eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const yearList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ date: years.date })
		.from(years)
		.innerJoin(olympiads, eq(years.olympiadId, olympiads.id))
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(
			and(
				eq(sql`lower(${subjects.name})`, params.subject),
				eq(sql`lower(${olympiads.name})`, params.olympiad)
			)
		);
	if (!yearList) error(404);
	return {
		subjectName: params.subject,
		olympiadName: params.olympiad,
		// @ts-expect-error wrong expected object
		yearDates: yearList.map((year) => year.date)
	};
};
