CREATE TABLE `user_scores` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`problem_id` integer NOT NULL,
	`problem_points` real,
	`scores` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `parts`;--> statement-breakpoint
DROP TABLE `subparts`;--> statement-breakpoint
ALTER TABLE `olympiads` ADD `name_lower` text NOT NULL;--> statement-breakpoint
ALTER TABLE `problems` ADD `parts` text NOT NULL;--> statement-breakpoint
ALTER TABLE `subjects` ADD `name_lower` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_name_lower_unique` ON `subjects` (`name_lower`);