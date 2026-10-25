CREATE TABLE `feed_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`payload` text NOT NULL,
	`published_at` text NOT NULL,
	`last_seen` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `feed_articles_url_unique` ON `feed_articles` (`url`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `articles` ADD `ad_eligible` integer DEFAULT 0 NOT NULL;