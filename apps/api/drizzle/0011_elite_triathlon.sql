ALTER TABLE "hunt_steps" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "hunt_steps" CASCADE;--> statement-breakpoint
ALTER TABLE "hunt_participants" ADD CONSTRAINT "hunt_participants_hunt_id_user_id_unique" UNIQUE("hunt_id","user_id");