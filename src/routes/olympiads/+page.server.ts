import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { subjects } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ setHeaders, locals }) => {
  const subjectList = await locals.db
    // @ts-expect-error drizzle type noise
    .select({ name: subjects.name })
    .from(subjects)
    .orderBy(subjects.name)
    .all();
  if (!subjectList) error(404);
  setHeaders({
    'Cache-Control': 'public, max-age=36000'
  });
  return {
    subjectNames: subjectList.map((subject) => subject.name)
  };
};
