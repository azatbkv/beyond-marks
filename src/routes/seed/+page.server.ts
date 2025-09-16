import { olympiads, years, subjects } from '$lib/server/db/schema';
import type { PageServerLoad } from '../olympiads/$types';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const subject: typeof subjects.$inferInsert = {
		name: 'Physics'
	};
	await locals.db
		.insert(subjects)
		.values(subject)
		.onConflictDoNothing();
    const subjectParent = await locals.db.select({ id: subjects.id }).from(subjects).where(eq(subjects.name, 'Physics'));
	const subjectId = subjectParent[0].id;
    const olympiad: typeof olympiads.$inferInsert = {
		name: 'IPhO',
		subjectId: subjectId
	};
	await locals.db
		.insert(olympiads)
		.values(olympiad)
		.onConflictDoNothing();
    const olympiadParent = await locals.db.select({ id: olympiads.id }).from(olympiads).where(eq(olympiads.name, 'IPhO'));
	const olympiadId = olympiadParent[0].id;
	const year: typeof years.$inferInsert = {
		date: 2025,
		olympiadId: olympiadId
	};
	await locals.db.insert(years).values(year).onConflictDoNothing();
};
