ALTER TABLE `subparts` RENAME COLUMN "max_points" TO "points";--> statement-breakpoint
ALTER TABLE `parts` ADD `solution` text NOT NULL;