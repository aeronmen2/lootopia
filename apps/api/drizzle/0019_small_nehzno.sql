ALTER TABLE "exchange" DROP CONSTRAINT "exchange_artifact_id_artefact_id_fk";
--> statement-breakpoint
ALTER TABLE "user_artefact" DROP CONSTRAINT "user_artefact_artifact_id_artefact_id_fk";
--> statement-breakpoint
ALTER TABLE "user_artefact" ALTER COLUMN "hunt_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exchange" ADD COLUMN "artefact_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_artefact" ADD COLUMN "artefact_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "exchange" ADD CONSTRAINT "exchange_artefact_id_artefact_id_fk" FOREIGN KEY ("artefact_id") REFERENCES "public"."artefact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artefact" ADD CONSTRAINT "user_artefact_artefact_id_artefact_id_fk" FOREIGN KEY ("artefact_id") REFERENCES "public"."artefact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange" DROP COLUMN "artifact_id";--> statement-breakpoint
ALTER TABLE "user_artefact" DROP COLUMN "artifact_id";