CREATE TABLE `analytics_ingest_limits` (
	`window_start` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
