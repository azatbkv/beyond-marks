DROP INDEX `olympiads_name_subject_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `olympiads_name_lower_subject_id_unique` ON `olympiads` (`name_lower`,`subject_id`);