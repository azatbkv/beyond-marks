import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { grades, olympiads, subjects, years } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders, locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	try {
		parseInt(params.year);
	} catch {
		error(404);
	}
	const gradesList = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ grade: grades.grade })
		.from(grades)
		.innerJoin(years, eq(grades.yearId, years.id))
		.innerJoin(olympiads, eq(years.olympiadId, olympiads.id))
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(
			and(
				eq(subjects.nameLower, params.subject),
				eq(olympiads.nameLower, params.olympiad),
				eq(years.date, parseInt(params.year))
			)
		)
		.orderBy(desc(grades.grade))
		.all();
	if (gradesList.length === 0) redirect(303, './' + params.year + '/1');
	setHeaders({
		'Cache-Control': 'public, max-age=3600'
	});
	return {
		subjectName: params.subject,
		olympiadName: params.olympiad,
		yearDate: params.year,
		// @ts-expect-error wrong expected object
		grades: gradesList.map((grade) => grade.grade)
	};
};
