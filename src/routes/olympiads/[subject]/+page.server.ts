import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { olympiads, subjects } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ setHeaders, locals, params }) => {
  // @ts-expect-error drizzle type noise
  const subject: { id: subjects.id; name: subjects.name } = await locals.db
    // @ts-expect-error drizzle type noise
    .select({ id: subjects.id, name: subjects.name })
    .from(subjects)
    .where(eq(subjects.nameLower, params.subject))
    .get();
  const olympiadList = await locals.db
    // @ts-expect-error drizzle type noise
    .select({ name: olympiads.name })
    .from(olympiads)
    .where(eq(olympiads.subjectId, subject.id))
    .orderBy(olympiads.id)
    .all();
  if (!olympiadList) error(404);
  setHeaders({
    'Cache-Control': 'public, max-age=36000'
  });
  return {
    subjectName: subject.name,
    olympiadNames: olympiadList.map((olympiad) => olympiad.name)
  };
};
