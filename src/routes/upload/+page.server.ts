import { env } from '$env/dynamic/private';
import { subjects, olympiads, years, problems, type Problem, grades } from '$lib/server/db/schema';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { and, eq, type InferInsertModel } from 'drizzle-orm';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	if (locals.user.id !== env.ADMIN_USER_ID) {
		throw error(403, 'not authorized to view this page');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login');
		}
		if (locals.user.id !== env.ADMIN_USER_ID) {
			throw error(403, 'not authorized to view this page');
		}

		const formData = await request.formData();

		const subjectName = formData.get('subject');
		if (typeof subjectName !== 'string' || !subjectName.trim()) return { error: 'bad subject' };

		const olympiadName = formData.get('olympiad');
		if (typeof olympiadName !== 'string' || !olympiadName.trim()) return { error: 'bad olympiad' };

		const yearRaw = formData.get('year');
		const yearDate = typeof yearRaw === 'string' ? parseInt(yearRaw, 10) : NaN;
		if (!Number.isFinite(yearDate)) return { error: 'bad year' };

		const gradeRaw = formData.get('grade');
		let gradeNumber = null;
		if (gradeRaw) {
			gradeNumber = typeof gradeRaw === 'string' ? parseInt(gradeRaw, 10) : NaN;
			if (!Number.isFinite(gradeNumber)) return { error: 'bad grade' };
		}

		const file = formData.get('file');
		if (!(file instanceof File)) {
			return { error: 'bad file' };
		}
		const fileText = await file.text();
		let jsonFile: Problem[];
		try {
			jsonFile = JSON.parse(fileText);
		} catch {
			return { error: 'invalid json' };
		}

		try {
			let subject = await locals.db
				// @ts-expect-error drizzle type noise
				.select({ id: subjects.id })
				.from(subjects)
				.where(eq(subjects.name, subjectName))
				.get();
			if (!subject)
				subject = await locals.db
					.insert(subjects)
					.values({ name: subjectName, nameLower: subjectName.toLowerCase() })
					.onConflictDoNothing()
					// @ts-expect-error drizzle type noise
					.returning({ id: subjects.id })
					.get();
			let olympiad = await locals.db
				// @ts-expect-error drizzle type noise
				.select({ id: olympiads.id })
				.from(olympiads)
				.where(and(eq(olympiads.name, olympiadName), eq(olympiads.subjectId, subject.id)))
				.get();
			if (!olympiad)
				olympiad = await locals.db
					.insert(olympiads)
					.values({
						name: olympiadName,
						subjectId: subject.id,
						nameLower: olympiadName.toLowerCase()
					})
					.onConflictDoNothing()
					// @ts-expect-error drizzle type noise
					.returning({ id: olympiads.id })
					.get();
			let year = await locals.db
				// @ts-expect-error drizzle type noise
				.select({ id: years.id })
				.from(years)
				.where(and(eq(years.date, yearDate), eq(years.olympiadId, olympiad.id)))
				.get();
			if (!year)
				year = await locals.db
					.insert(years)
					.values({ date: yearDate, olympiadId: olympiad.id })
					.onConflictDoNothing()
					// @ts-expect-error drizzle type noise
					.returning({ id: years.id })
					.get();
			let grade = null;
			if (gradeNumber) {
				grade = await locals.db
					// @ts-expect-error drizzle type noise
					.select({ id: grades.id })
					.from(grades)
					.where(and(eq(grades.grade, gradeNumber), eq(grades.yearId, year.id)))
					.get();
				if (!grade)
					grade = await locals.db
						.insert(grades)
						.values({ grade: gradeNumber, yearId: year.id })
						.onConflictDoNothing()
						// @ts-expect-error drizzle type noise
						.returning({ id: grades.id })
						.get();
			}
			for (let i = 0; i < jsonFile.length; i++) {
				const problemFile = jsonFile[i];
				const problem: InferInsertModel<typeof problems> = {
					number: problemFile.number,
					name: problemFile.name,
					maxPoints: problemFile.maxPoints,
					weightedMaxPoints: problemFile.weightedMaxPoints,
					parts: problemFile.parts,
					yearId: year.id,
					gradeId: grade?.id ?? null
				};
				await locals.db.insert(problems).values(problem);
				/**
					// @ts-expect-error drizzle type noise
					.returning({ id: problems.id })
					.get();
				for (let j = 0; j < problemFile.parts.length; j++) {
					const partFile = problemFile.parts[j];
					const part: InferInsertModel<typeof parts> = {
						number: partFile.number,
						description: partFile.description,
						solution: partFile.solution,
						maxPoints: partFile.maxPoints,
						problemId: problemInserted.id
					};
					console.log(part);
					const partInserted = await locals.db
						.insert(parts)
						.values(part)
						// @ts-expect-error drizzle type noise
						.returning({ id: parts.id })
						.get();
					for (let k = 0; k < partFile.subparts.length; k++) {
						const subpartFile = partFile.subparts[k];
						const subpart: InferInsertModel<typeof subparts> = {
							index: subpartFile.index,
							description: subpartFile.description,
							parentSubpartId: subpartFile.parentSubpartId,
							type: subpartFile.type,
							points: subpartFile.points,
							partId: partInserted.id
						};
						await locals.db.insert(subparts).values(subpart);
					}
				}
				**/
			}
		} catch {
			return { error: 'error in database' };
		}
		return { success: true };
	}
};
