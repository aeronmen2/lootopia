ALTER TABLE "users" ADD COLUMN "twoFactorEnabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "twoFactorSecret" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "twoFactorBackupCodes" text[];