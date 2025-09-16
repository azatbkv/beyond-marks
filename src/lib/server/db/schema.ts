import {
	sqliteTable,
	text,
	integer,
	unique,
	real,
	type AnySQLiteColumn
} from 'drizzle-orm/sqlite-core';

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
		solution: text().notNull(),
		maxPoints: real('max_points').notNull(),
		problemId: integer('problem_id')
			.notNull()
			.references(() => problems.id)
	},
	(table) => [unique().on(table.number, table.problemId)]
);

export const subparts = sqliteTable(
	'subparts',
	{
		id: integer().primaryKey(),
		index: integer().notNull(),
		description: text().notNull(),
		parentSubpartId: integer('parent_subpart_id').references((): AnySQLiteColumn => subparts.id),
		type: text('type', { enum: ['closed', 'open'] })
			.notNull()
			.default('closed'),
		points: real().notNull(),
		partId: integer('part_id')
			.notNull()
			.references(() => parts.id)
	},
	(table) => [unique().on(table.index, table.partId)]
);
