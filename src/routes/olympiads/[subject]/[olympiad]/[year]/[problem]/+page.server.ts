import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { and, eq, type InferSelectModel } from 'drizzle-orm';
import {
	olympiads,
	problems,
	subjects,
	users,
	userScores,
	years,
	type PartPoints,
	type Problem,
	type Subpart,
	type SubpartPoints
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	// @ts-expect-error drizzle type mismatch
	const problemFound: InferSelectModel<typeof problems> = await locals.db
		// @ts-expect-error drizzle type noise
		.select(problems)
		.from(problems)
		.innerJoin(years, eq(problems.yearId, years.id))
		.innerJoin(olympiads, eq(years.olympiadId, olympiads.id))
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id))
		.where(
			and(
				eq(subjects.nameLower, params.subject),
				eq(olympiads.nameLower, params.olympiad),
				eq(years.date, parseInt(params.year)),
				// @ts-expect-error expected params error
				eq(problems.number, parseInt(params.problem))
			)
		)
		.get();
	if (!problemFound) error(404);

	const problem: Problem = {
		number: problemFound.number,
		name: problemFound.name,
		maxPoints: problemFound.maxPoints,
		weightedMaxPoints: problemFound.weightedMaxPoints,
		parts: problemFound.parts
	};

	function makeSubpartPoints(subpart: Subpart): SubpartPoints {
		const subpartPoints: SubpartPoints = {
			obtainedPoints: 0,
			childSubparts: []
		};
		for (let i = 0; i < subpart.childSubparts.length; i++) {
			const childSubpart = subpart.childSubparts[i];
			const childSubpartPoints = makeSubpartPoints(childSubpart);
			subpartPoints.childSubparts.push(childSubpartPoints);
		}
		return subpartPoints;
	}

	// @ts-expect-error drizzle type mismatch
	let scoreFound: { problemPoints: number; scores: PartPoints[] } = await locals.db
		// @ts-expect-error drizzle type noise
		.select({ problemPoints: userScores.problemPoints, scores: userScores.scores })
		.from(userScores)
		.innerJoin(problems, eq(problems.id, userScores.problemId))
		.innerJoin(users, eq(users.id, userScores.userId))
		.where(and(eq(problems.id, problemFound.id), eq(users.id, locals.user.id)))
		.get();
	if (!scoreFound) {
		const scores: PartPoints[] = [];
		for (let i = 0; i < problem.parts.length; i++) {
			const part = problem.parts[i];
			const partPoints: PartPoints = {
				number: part.number,
				obtainedPoints: 0,
				subparts: []
			};
			for (let j = 0; j < part.subparts.length; j++) {
				const subpart = part.subparts[j];
				const subpartPoints = makeSubpartPoints(subpart);
				partPoints.subparts.push(subpartPoints);
			}
			scores.push(partPoints);
		}
		scoreFound = {
			problemPoints: 0,
			scores: scores
		};
	}

	const allProblems = await locals.db
		// @ts-expect-error drizzle type noise
		.select({
			number: problems.number,
			name: problems.name
		})
		.from(problems)
		.innerJoin(years, eq(problems.yearId, years.id))
		.where(eq(years.id, problemFound.yearId))
		.orderBy(problems.number)
		.all();

	return {
		problem: problem,
		userScore: scoreFound,
		allProblems: allProblems
	};
};
