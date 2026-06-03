CREATE TABLE `git_ocean_creatures` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`repo_id` text NOT NULL,
	`creature_type` text NOT NULL,
	`creature_name` text NOT NULL,
	`position_x` real DEFAULT 0 NOT NULL,
	`position_y` real DEFAULT 0 NOT NULL,
	`position_z` real DEFAULT 0 NOT NULL,
	`scale_x` real DEFAULT 1 NOT NULL,
	`scale_y` real DEFAULT 1 NOT NULL,
	`scale_z` real DEFAULT 1 NOT NULL,
	`health` integer DEFAULT 100 NOT NULL,
	`level` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`repo_id`) REFERENCES `git_ocean_repositories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `creatures_user_id_idx` ON `git_ocean_creatures` (`user_id`);--> statement-breakpoint
CREATE INDEX `creatures_repo_id_idx` ON `git_ocean_creatures` (`repo_id`);--> statement-breakpoint
CREATE TABLE `git_ocean_github_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text NOT NULL,
	`github_username` text NOT NULL,
	`github_avatar_url` text,
	`scope` text,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `git_ocean_github_connections_user_id_unique` ON `git_ocean_github_connections` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `github_connections_user_id_idx` ON `git_ocean_github_connections` (`user_id`);--> statement-breakpoint
CREATE TABLE `git_ocean_states` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`whale_size` integer DEFAULT 1 NOT NULL,
	`whale_color` text DEFAULT '#06B6D4' NOT NULL,
	`ocean_depth` integer DEFAULT 0 NOT NULL,
	`coral_count` integer DEFAULT 0 NOT NULL,
	`total_creatures` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `git_ocean_states_user_id_unique` ON `git_ocean_states` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `ocean_states_user_id_idx` ON `git_ocean_states` (`user_id`);--> statement-breakpoint
CREATE TABLE `git_ocean_repositories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`github_repo_id` integer NOT NULL,
	`full_name` text NOT NULL,
	`description` text,
	`language` text,
	`stars` integer DEFAULT 0 NOT NULL,
	`forks` integer DEFAULT 0 NOT NULL,
	`issues` integer DEFAULT 0 NOT NULL,
	`prs` integer DEFAULT 0 NOT NULL,
	`last_pushed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `repositories_user_github_idx` ON `git_ocean_repositories` (`user_id`,`github_repo_id`);--> statement-breakpoint
CREATE TABLE `git_ocean_world_map` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`country` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`repo_count` integer DEFAULT 0 NOT NULL,
	`contribution_count` integer DEFAULT 0 NOT NULL,
	`unlocked` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `world_map_user_country_idx` ON `git_ocean_world_map` (`user_id`,`country`);