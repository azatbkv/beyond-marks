import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel } from 'drizzle-orm';

export const subjects = sqliteTable('subjects', {
	id: integer().primaryKey(),
	name: text().notNull().unique()
});

export const olympiads = sqliteTable('olympiads', {
	id: integer().primaryKey(),
	name: text().notNull(),
	subjectId: integer('subject_id')
		.notNull()
		.references(() => subjects.id)
});

export const years = sqliteTable('years', {
	id: integer().primaryKey(),
	year: integer().notNull(),
	olympiadId: integer('olympiad_id')
		.notNull()
		.references(() => olympiads.id)
});

export type Subject = InferSelectModel<typeof subjects>;
export type Olympiads = InferSelectModel<typeof olympiads>;
export type Years = InferSelectModel<typeof years>;
