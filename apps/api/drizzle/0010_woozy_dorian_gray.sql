ALTER TABLE "artefacts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "crown_transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "marketplace_listings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rewards" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_artefacts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_rewards" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_wallets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "artefacts" CASCADE;--> statement-breakpoint
DROP TABLE "crown_transactions" CASCADE;--> statement-breakpoint
DROP TABLE "marketplace_listings" CASCADE;--> statement-breakpoint
DROP TABLE "rewards" CASCADE;--> statement-breakpoint
DROP TABLE "user_artefacts" CASCADE;--> statement-breakpoint
DROP TABLE "user_rewards" CASCADE;--> statement-breakpoint
DROP TABLE "user_wallets" CASCADE;--> statement-breakpoint
ALTER TABLE "caches" DROP CONSTRAINT "caches_content_id_rewards_id_fk";
--> statement-breakpoint
ALTER TABLE "dig_actions" DROP CONSTRAINT "dig_actions_artefact_used_artefacts_id_fk";
--> statement-breakpoint
ALTER TABLE "caches" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "caches" DROP COLUMN "content_id";--> statement-breakpoint
ALTER TABLE "dig_actions" DROP COLUMN "artefact_used";