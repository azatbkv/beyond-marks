PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_subparts` (
	`id` integer PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`parent_subpart_id` integer,
	`type` text DEFAULT 'closed' NOT NULL,
	`max_points` real NOT NULL,
	`part_id` integer NOT NULL,
	FOREIGN KEY (`parent_subpart_id`) REFERENCES `subparts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`part_id`) REFERENCES `parts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_subparts`("id", "description", "parent_subpart_id", "type", "max_points", "part_id") SELECT "id", "description", "parent_subpart_id", "type", "max_points", "part_id" FROM `subparts`;--> statement-breakpoint
DROP TABLE `subparts`;--> statement-breakpoint
ALTER TABLE `__new_subparts` RENAME TO `subparts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;