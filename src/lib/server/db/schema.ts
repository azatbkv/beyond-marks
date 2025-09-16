import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, unique, real } from 'drizzle-orm/sqlite-core';

export const subjects = sqliteTable('subjects', {
	id: integer().primaryKey(),
	name: text().notNull().unique()
});

export const olympiads = sqliteTable(
	'olympiads',
	{
		id: integer().primaryKey(),
		name: text().notNull(),
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

export const problems = sqliteTable(
	'problems',
	{
		id: integer().primaryKey(),
		number: integer().notNull(),
		name: text().notNull(),
		maxPoints: real('max_points').notNull(),
		weightedMaxPoints: real('weighted_max_points').notNull(),
		yearId: integer('year_id')
			.notNull()
			.references(() => years.id)
	},
	(table) => [unique().on(table.number, table.yearId)]
);

export const parts = sqliteTable(
	'parts',
	{
		id: integer().primaryKey(),
		number: text().notNull(),
		description: text().notNull(),
		maxPoints: real('max_points').notNull(),
		problemId: integer('problem_id')
			.notNull()
			.references(() => problems.id)
	},
	(table) => [unique().on(table.number, table.problemId)]
);

export const subparts = sqliteTable('subparts', {
	id: integer().primaryKey(),
	description: text().notNull(),
	parentSubpartId: integer('parent_subpart_id'),
	type: text('type', { enum: ['closed', 'open'] })
		.notNull()
		.default('closed'),
	maxPoints: real('max_points').notNull(),
	partId: integer('part_id')
		.notNull()
		.references(() => parts.id)
});

export const subpartsRelations = relations(subparts, ({ one, many }) => ({
	parent: one(subparts, {
		fields: [subparts.parentSubpartId],
		references: [subparts.id]
	}),
	children: many(subparts)
}));
