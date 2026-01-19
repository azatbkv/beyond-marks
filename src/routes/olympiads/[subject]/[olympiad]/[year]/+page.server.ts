import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { grades, olympiads, subjects, years } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders, locals, params }) => {
  try {
    parseInt(params.year);
  } catch {
    error(404);
  }
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
  // @ts-expect-error drizzle type noise
  const year: { id: years.id } = await locals.db
    // @ts-expect-error drizzle type noise
    .select({ id: years.id, date: years.date })
    .from(years)
    .where(and(eq(years.date, parseInt(params.year)), eq(years.olympiadId, olympiad.id)))
    .get();
  const gradesList = await locals.db
    // @ts-expect-error drizzle type noise
    .select({ grade: grades.grade })
    .from(grades)
    .where(eq(grades.yearId, year.id))
    .orderBy(grades.grade)
    .all();
  if (gradesList.length === 0) redirect(303, './' + params.year + '/1');
  setHeaders({
    'Cache-Control': 'public, max-age=3600'
  });
  return {
    subjectName: subject.name,
    olympiadName: olympiad.name,
    yearDate: params.year,
    grades: gradesList.map((grade) => grade.grade)
  };
};
