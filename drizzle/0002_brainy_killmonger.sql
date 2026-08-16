ALTER TABLE `site_pages` ADD `headerAlign` enum('left','center','right') DEFAULT 'left' NOT NULL;--> statement-breakpoint
ALTER TABLE `site_pages` ADD `bodyAlign` enum('left','center','right') DEFAULT 'left' NOT NULL;--> statement-breakpoint
ALTER TABLE `site_pages` ADD `ctaAlign` enum('left','center','right') DEFAULT 'left' NOT NULL;