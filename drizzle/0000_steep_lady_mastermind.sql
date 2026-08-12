CREATE TABLE `analytics_counts` (
	`bucket` text NOT NULL,
	`dimension` text NOT NULL,
	`value` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`bucket`, `dimension`, `value`)
);
