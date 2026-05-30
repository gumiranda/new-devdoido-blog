CREATE TYPE "public"."cron_log_status" AS ENUM('ok', 'partial', 'error');--> statement-breakpoint
CREATE TYPE "public"."transcript_status" AS ENUM('pending', 'processing', 'done', 'error');--> statement-breakpoint
CREATE TABLE "cron_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" text NOT NULL,
	"run_id" uuid,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"status" "cron_log_status" DEFAULT 'ok' NOT NULL,
	"quota_remaining" integer,
	"quota_reset_at" timestamp,
	"message" text,
	"context_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "og_image_url" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "twitter_card" text;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "schema_json" jsonb;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "faq_json" jsonb;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "answer_box" text;--> statement-breakpoint
ALTER TABLE "channel" ADD COLUMN "last_synced_at" timestamp;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "transcript_status" "transcript_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "transcript_retry_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "transcript_next_retry_at" timestamp;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "transcript_error" text;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "transcript_provider" text DEFAULT 'gladia' NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_log" ADD CONSTRAINT "cron_log_workspace_id_organization_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cron_log" ADD CONSTRAINT "cron_log_run_id_run_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."run"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "video_ws_ytid" ON "video" USING btree ("workspace_id","youtube_video_id");