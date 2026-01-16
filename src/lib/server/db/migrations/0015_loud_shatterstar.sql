PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_grades` (
	`id` integer PRIMARY KEY NOT NULL,
	`grade` text NOT NULL,
	`year_id` integer NOT NULL,
	FOREIGN KEY (`year_id`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_grades`("id", "grade", "year_id") SELECT "id", "grade", "year_id" FROM `grades`;--> statement-breakpoint
DROP TABLE `grades`;--> statement-breakpoint
ALTER TABLE `__new_grades` RENAME TO `grades`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `grades_grade_year_id_unique` ON `grades` (`grade`,`year_id`);