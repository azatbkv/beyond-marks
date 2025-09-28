import { sqliteTable, text, integer, unique, real } from 'drizzle-orm/sqlite-core';

export const subjects = sqliteTable('subjects', {
	id: integer().primaryKey(),
	name: text().notNull().unique(),
	nameLower: text('name_lower').notNull().unique()
});

export const olympiads = sqliteTable(
	'olympiads',
	{
		id: integer().primaryKey(),
		name: text().notNull(),
		nameLower: text('name_lower').notNull(),
		subjectId: integer('subject_id')
			.notNull()
			.references(() => subjects.id)
	},
	(table) => [unique().on(table.name, table.subjectId)]
);

export const years = sqliteTable(
	'years',
	{
		id: integer().primaryKey(),
		date: integer().notNull(),
		olympiadId: integer('olympiad_id')
			.notNull()
			.references(() => olympiads.id)
	},
	(table) => [unique().on(table.date, table.olympiadId)]
);

export const grades = sqliteTable(
	'grades',
	{
		id: integer().primaryKey(),
		grade: integer().notNull(),
		yearId: integer('year_id')
			.notNull()
			.references(() => years.id)
	},
	(table) => [unique().on(table.grade, table.yearId)]
);

export const problems = sqliteTable(
	'problems',
	{
		id: integer().primaryKey(),
		number: integer().notNull(),
		name: text().notNull(),
		maxPoints: real('max_points').notNull(),
		weightedMaxPoints: real('weighted_max_points').notNull(),
		parts: text('parts', { mode: 'json' }).$type<Part[]>().notNull(),
		gradeId: integer('grade_id').references(() => grades.id),
		yearId: integer('year_id')
			.notNull()
			.references(() => years.id)
	},
	(table) => [unique().on(table.number, table.gradeId, table.yearId)]
);

export type Subpart = {
	description: string;
	points: number;
	type: 'closed' | 'open';
	childSubparts: Subpart[];
};

export type Part = {
	number: string;
	description: string;
	solution: string;
	maxPoints: number;
	subparts: Subpart[];
};

export type Problem = {
	number: number;
	name: string;
	maxPoints: number;
	weightedMaxPoints: number;
	parts: Part[];
};

export type SubpartPoints = {
	obtainedPoints: number;
	childSubparts: SubpartPoints[];
};

export type PartPoints = {
	number: string;
	obtainedPoints: number;
	subparts: SubpartPoints[];
};

export const userScores = sqliteTable(
	'user_scores',
	{
		id: integer().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		problemId: integer('problem_id')
			.notNull()
			.references(() => problems.id),
		problemPoints: real('problem_points'),
		scores: text('scores', { mode: 'json' }).$type<PartPoints[]>().notNull()
	},
	(table) => [unique().on(table.problemId, table.userId)]
);

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
});

export const accounts = sqliteTable('accounts', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', {
		mode: 'timestamp'
	}),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', {
		mode: 'timestamp'
	}),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});

export const verifications = sqliteTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).defaultNow().notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull()
});
