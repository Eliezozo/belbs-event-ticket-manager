ALTER TABLE "participations" ADD COLUMN "scanned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "participations" DROP COLUMN "scanned_at";