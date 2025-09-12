CREATE TABLE `olympiads` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`subject_id` integer NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_name_unique` ON `subjects` (`name`);--> statement-breakpoint
CREATE TABLE `years` (
	`id` integer PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`olympiad_id` integer NOT NULL,
	FOREIGN KEY (`olympiad_id`) REFERENCES `olympiads`(`id`) ON UPDATE no action ON DELETE no action
);
