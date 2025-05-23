CREATE TABLE "artefact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"rarity" text NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"step_id" uuid NOT NULL,
	"lat" numeric NOT NULL,
	"lng" numeric NOT NULL,
	"size_cm" integer DEFAULT 80,
	"is_visible" boolean DEFAULT false,
	"precision_m" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dig" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_id" uuid,
	"user_id" uuid NOT NULL,
	"lat" integer NOT NULL,
	"lng" integer NOT NULL,
	"dig_time" timestamp DEFAULT now() NOT NULL,
	"result" text NOT NULL,
	"crowns_spent" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "exchange" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"artifact_id" uuid NOT NULL,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"name" text,
	"skin" text,
	"zone" text,
	"scale_min" numeric,
	"scale_max" numeric,
	"is_for_dig" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	CONSTRAINT "participant_hunt_id_user_id_unique" UNIQUE("hunt_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "step" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"content" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userStep" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"step_id" uuid NOT NULL,
	"is_valid" boolean DEFAULT false,
	"validated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_artefact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"artifact_id" uuid NOT NULL,
	"hunt_id" uuid NOT NULL,
	"obtained_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "caches" CASCADE;--> statement-breakpoint
DROP TABLE "dig_actions" CASCADE;--> statement-breakpoint
DROP TABLE "hunt_maps" CASCADE;--> statement-breakpoint
DROP TABLE "hunt_markers" CASCADE;--> statement-breakpoint
DROP TABLE "hunt_participants" CASCADE;--> statement-breakpoint
ALTER TABLE "cache" ADD CONSTRAINT "cache_step_id_step_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."step"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dig" ADD CONSTRAINT "dig_cache_id_cache_id_fk" FOREIGN KEY ("cache_id") REFERENCES "public"."cache"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dig" ADD CONSTRAINT "dig_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange" ADD CONSTRAINT "exchange_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange" ADD CONSTRAINT "exchange_artifact_id_artefact_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artefact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "step" ADD CONSTRAINT "step_map_id_map_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."map"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userStep" ADD CONSTRAINT "userStep_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userStep" ADD CONSTRAINT "userStep_step_id_step_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."step"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artefact" ADD CONSTRAINT "user_artefact_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artefact" ADD CONSTRAINT "user_artefact_artifact_id_artefact_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artefact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_artefact" ADD CONSTRAINT "user_artefact_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;