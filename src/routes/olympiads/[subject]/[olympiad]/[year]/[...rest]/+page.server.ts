import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import {
	grades,
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
	let gradeParam = null;
	let problemParam = null;
	// @ts-expect-error params type noise
	const rest = params.rest.split('/');
	if (rest.length === 1) {
		problemParam = rest[0];
	} else if (rest.length === 2) {
		[gradeParam, problemParam] = rest;
	} else error(404);
	let query = locals.db
		// @ts-expect-error drizzle type noise
		.select(problems)
		.from(problems)
		.innerJoin(years, eq(problems.yearId, years.id))
		.innerJoin(olympiads, eq(years.olympiadId, olympiads.id))
		.innerJoin(subjects, eq(olympiads.subjectId, subjects.id));

	const problemFoundConditions = [
		eq(subjects.nameLower, params.subject),
		eq(olympiads.nameLower, params.olympiad),
		eq(years.date, parseInt(params.year)),
		eq(problems.number, parseInt(problemParam))
	];

	if (gradeParam) {
		query = query.innerJoin(grades, eq(problems.gradeId, grades.id));
		problemFoundConditions.push(eq(grades.grade, parseInt(gradeParam)));
	}

	// @ts-expect-error drizzle type noise
	const problemFound: InferSelectModel<typeof problems> = await query
		.where(and(...problemFoundConditions))
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
	let scoreFound: InferInsertModel<typeof userScores> = await locals.db
		// @ts-expect-error drizzle type noise
		.select({
			userId: userScores.userId,
			problemId: userScores.problemId,
			problemPoints: userScores.problemPoints,
			scores: userScores.scores
		})
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
			userId: locals.user.id,
			problemId: problemFound.id,
			problemPoints: 0,
			scores: scores
		};
	}

	let queryAllProblems = locals.db
		// @ts-expect-error drizzle type noise
		.select({
			number: problems.number,
			name: problems.name
		})
		.from(problems)
		.innerJoin(years, eq(problems.yearId, years.id));

	const allProblemsConditions = [eq(years.id, problemFound.yearId)];

	if (problemFound.gradeId != null) {
		queryAllProblems = queryAllProblems.innerJoin(grades, eq(problems.gradeId, grades.id));
		allProblemsConditions.push(eq(grades.id, problemFound.gradeId));
	}

	const allProblems = await queryAllProblems
		.where(and(...allProblemsConditions))
		.orderBy(problems.number)
		.all();

	return {
		problem: problem,
		userScore: scoreFound,
		allProblems: allProblems
	};
};
