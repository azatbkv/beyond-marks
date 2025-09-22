import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { subjects, olympiads, years, problems, parts, subparts } from '$lib/server/db/schema';
import type { Actions } from '@sveltejs/kit';
import { and, eq, type InferInsertModel } from 'drizzle-orm';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const password = formData.get('password');
		if (typeof password !== 'string') return { error: 'bad password' };

		let secret;
		if (dev) {
			secret = env.UPLOAD_SECRET_DEV;
		} else {
			secret = env.UPLOAD_SECRET;
		}

		if (!secret) throw new Error('no upload secret');
		if (password !== secret) return { error: 'incorrect password' };

		const subjectName = formData.get('subject');
		if (typeof subjectName !== 'string' || !subjectName.trim()) return { error: 'bad subject' };

		const olympiadName = formData.get('olympiad');
		if (typeof olympiadName !== 'string' || !olympiadName.trim()) return { error: 'bad olympiad' };

		const yearRaw = formData.get('year');
		const yearDate = typeof yearRaw === 'string' ? parseInt(yearRaw, 10) : NaN;
		if (!Number.isFinite(yearDate)) return { error: 'bad year' };

		const file = formData.get('file');
		if (!(file instanceof File)) {
			return { error: 'bad file' };
		}
		const fileText = await file.text();
		let jsonFile;
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
					.values({ name: subjectName })
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
					.values({ name: olympiadName as string, subjectId: subject.id })
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
			for (let i = 0; i < jsonFile.length; i++) {
				const problemFile = jsonFile[i];
				const problem: InferInsertModel<typeof problems> = {
					number: problemFile.number,
					name: problemFile.name,
					maxPoints: problemFile.maxPoints,
					weightedMaxPoints: problemFile.weightedMaxPoints,
					yearId: year.id
				};
				const problemInserted = await locals.db
					.insert(problems)
					.values(problem)
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
			}
		} catch {
			return { error: 'fail in database' };
		}
		return { success: true };
	}
};
