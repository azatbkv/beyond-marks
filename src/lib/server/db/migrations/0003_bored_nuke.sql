CREATE TABLE `parts` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` text NOT NULL,
	`description` text NOT NULL,
	`max_points` real NOT NULL,
	`problem_id` integer NOT NULL,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `parts_number_problem_id_unique` ON `parts` (`number`,`problem_id`);--> statement-breakpoint
CREATE TABLE `problems` (
	`id` integer PRIMARY KEY NOT NULL,
	`number` integer NOT NULL,
	`name` text NOT NULL,
	`max_points` real NOT NULL,
	`weighted_max_points` real NOT NULL,
	`year_id` integer NOT NULL,
	FOREIGN KEY (`year_id`) REFERENCES `years`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `problems_number_year_id_unique` ON `problems` (`number`,`year_id`);--> statement-breakpoint
CREATE TABLE `subparts` (
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`parent_subpart_id` integer,
	`type` text DEFAULT 'closed' NOT NULL,
	`max_points` real NOT NULL,
	`part_id` integer NOT NULL,
	FOREIGN KEY (`part_id`) REFERENCES `parts`(`id`) ON UPDATE no action ON DELETE no action
);
