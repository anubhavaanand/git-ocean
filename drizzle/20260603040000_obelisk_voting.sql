CREATE TABLE `git_ocean_obelisk_skins` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`model_config` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`epoch` integer NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `git_ocean_obelisk_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`skin_id` text NOT NULL,
	`user_id` text NOT NULL,
	`country_code` text NOT NULL,
	`epoch` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`skin_id`) REFERENCES `git_ocean_obelisk_skins`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `obelisk_votes_user_skin_country_idx` ON `git_ocean_obelisk_votes` (`user_id`, `skin_id`, `country_code`);
--> statement-breakpoint
CREATE TABLE `git_ocean_obelisk_epochs` (
	`id` text PRIMARY KEY NOT NULL,
	`epoch` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`active` integer NOT NULL DEFAULT true
);
--> statement-breakpoint
CREATE UNIQUE INDEX `git_ocean_obelisk_epochs_epoch_unique` ON `git_ocean_obelisk_epochs` (`epoch`);
