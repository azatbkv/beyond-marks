PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_grades` (
	`id` integer PRIMARY KEY NOT NULL,
	`grade` integer NOT NULL,
	`year_id` integer NOT NULL,
	FOREIGN KEY (`year_id`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_grades`("id", "grade", "year_id") SELECT "id", "grade", "year_id" FROM `grades`;--> statement-breakpoint
DROP TABLE `grades`;--> statement-breakpoint
ALTER TABLE `__new_grades` RENAME TO `grades`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `grades_grade_year_id_unique` ON `grades` (`grade`,`year_id`);--> statement-breakpoint
CREATE TABLE `__new_olympiads` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_lower` text NOT NULL,
	`subject_id` integer NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_olympiads`("id", "name", "name_lower", "subject_id") SELECT "id", "name", "name_lower", "subject_id" FROM `olympiads`;--> statement-breakpoint
DROP TABLE `olympiads`;--> statement-breakpoint
ALTER TABLE `__new_olympiads` RENAME TO `olympiads`;--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_name_subject_id_unique` ON `olympiads` (`name`,`subject_id`);--> statement-breakpoint
CREATE TABLE `__new_problems` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`name` text NOT NULL,
	`max_points` real NOT NULL,
	`weighted_max_points` real NOT NULL,
	`parts` text NOT NULL,
	`grade_id` integer,
	`year_id` integer NOT NULL,
	FOREIGN KEY (`grade_id`) REFERENCES `grades`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`year_id`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_problems`("id", "number", "name", "max_points", "weighted_max_points", "parts", "grade_id", "year_id") SELECT "id", "number", "name", "max_points", "weighted_max_points", "parts", "grade_id", "year_id" FROM `problems`;--> statement-breakpoint
DROP TABLE `problems`;--> statement-breakpoint
ALTER TABLE `__new_problems` RENAME TO `problems`;--> statement-breakpoint
CREATE UNIQUE INDEX `problems_number_grade_id_year_id_unique` ON `problems` (`number`,`grade_id`,`year_id`);--> statement-breakpoint
CREATE TABLE `__new_user_scores` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`problem_id` integer NOT NULL,
	`problem_points` real,
	`scores` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_scores`("id", "user_id", "problem_id", "problem_points", "scores") SELECT "id", "user_id", "problem_id", "problem_points", "scores" FROM `user_scores`;--> statement-breakpoint
DROP TABLE `user_scores`;--> statement-breakpoint
ALTER TABLE `__new_user_scores` RENAME TO `user_scores`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_scores_problem_id_user_id_unique` ON `user_scores` (`problem_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `__new_years` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	`olympiad_id` integer NOT NULL,
	FOREIGN KEY (`olympiad_id`) REFERENCES `olympiads`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_years`("id", "date", "olympiad_id") SELECT "id", "date", "olympiad_id" FROM `years`;--> statement-breakpoint
DROP TABLE `years`;--> statement-breakpoint
ALTER TABLE `__new_years` RENAME TO `years`;--> statement-breakpoint
CREATE UNIQUE INDEX `years_date_olympiad_id_unique` ON `years` (`date`,`olympiad_id`);