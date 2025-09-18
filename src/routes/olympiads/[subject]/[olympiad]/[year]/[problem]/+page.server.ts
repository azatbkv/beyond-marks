import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { and, eq, sql } from 'drizzle-orm';
import {
	olympiads,
	parts,
	problems,
	subjects,
	subparts,
	years,
	type Part,
	type Subpart
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
	const problemFound = await locals.db
		.select({ id: problems.id })
		.from(problems)
		.innerJoin(years, eq(problems.yearId, years.id))
		.innerJoin(olympiads, eq(years.olympiadId, olympiads.id))
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(
			and(
				eq(sql`lower(${subjects.name})`, params.subject),
				eq(sql`lower(${olympiads.name})`, params.olympiad),
				eq(years.date, parseInt(params.year)),
				eq(problems.number, parseInt(params.problem))
			)
		)
		.get();
	if (!problemFound) error(404);
	const rows = await locals.db
		.select()
		.from(problems)
		.leftJoin(parts, eq(parts.problemId, problems.id))
		.leftJoin(subparts, eq(subparts.partId, parts.id))
		.where(eq(problems.id, problemFound.id));

	const problem = { ...rows[0].problems, parts: [] as PartWithSubs[] };
	const partMap = new Map<number, PartWithSubs>();

	for (let i = 0; i < rows.length; i++) {
		const r = rows[i];
		if (r.parts && !partMap.has(r.parts.id)) {
			const part: PartWithSubs = { ...r.parts, subparts: [] };
			partMap.set(r.parts.id, part);
			problem.parts.push(part);
		}
		if (r.parts && r.subparts) {
			partMap.get(r.parts.id)?.subparts.push({ ...r.subparts });
		}
	}
	return {
		problem: problem
	};
};

export type PartWithSubs = Part & { subparts: Subpart[] };
