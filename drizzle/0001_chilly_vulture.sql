CREATE TABLE `site_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(120) NOT NULL,
	`url` text NOT NULL,
	`location` enum('header','footer') NOT NULL,
	`isExternal` boolean NOT NULL DEFAULT false,
	`isVisible` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 100,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(220) NOT NULL,
	`eyebrow` varchar(120) NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`imageUrl` text NOT NULL,
	`imageAlt` varchar(220) NOT NULL,
	`ctaLabel` varchar(120) NOT NULL,
	`ctaUrl` text NOT NULL,
	`navLabel` varchar(120) NOT NULL,
	`showInNav` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 100,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_pages_slug_unique` UNIQUE(`slug`)
);
