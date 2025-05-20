ALTER TABLE "sessions" ADD COLUMN "timestamp1" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "timestamp2" timestamp DEFAULT now() NOT NULL;