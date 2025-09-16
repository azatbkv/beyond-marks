ALTER TABLE `subparts` ADD `index` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `subparts_index_part_id_unique` ON `subparts` (`index`,`part_id`);