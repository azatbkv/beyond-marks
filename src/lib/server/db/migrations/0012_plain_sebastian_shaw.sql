CREATE TABLE `grades` (
	`id` integer PRIMARY KEY NOT NULL,
	`grade` integer NOT NULL,
	`year_id` integer NOT NULL,
	FOREIGN KEY (`year_id`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grades_grade_year_id_unique` ON `grades` (`grade`,`year_id`);--> statement-breakpoint
DROP INDEX `problems_number_year_id_unique`;--> statement-breakpoint
ALTER TABLE `problems` ADD `grade_id` integer REFERENCES grades(id);--> statement-breakpoint
CREATE UNIQUE INDEX `problems_number_grade_id_year_id_unique` ON `problems` (`number`,`grade_id`,`year_id`);