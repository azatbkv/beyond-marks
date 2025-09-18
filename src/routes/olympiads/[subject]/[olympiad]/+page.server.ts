import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { olympiads, years } from '$lib/server/db/schema';
import { sql, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	const olympiad = await locals.db
	// @ts-expect-error drizzle type defs mismatch
		.select({ id: olympiads.id })
		.from(olympiads)
		.where(eq(sql`lower(${olympiads.name})`, params.olympiad));
	if (!olympiad) error(404);
	const olympiadId = olympiad[0].id;
	const yearList = await locals.db
	// @ts-expect-error drizzle type noise
		.select({ date: years.date })
		.from(years)
		.where(eq(years.olympiadId, olympiadId));
	if (!yearList) error(404);
	return {
		subjectName: params.subject,
		olympiadName: params.olympiad,
		yearDates: yearList.map((year) => year.date)
	};
};
