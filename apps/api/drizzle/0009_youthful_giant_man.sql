CREATE TABLE "artefacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rarity" text NOT NULL,
	"image_url" text,
	"series" text,
	"usable_in_game" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "caches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"map_id" uuid,
	"lat" numeric NOT NULL,
	"lng" numeric NOT NULL,
	"size_cm" integer DEFAULT 80,
	"is_visible" boolean DEFAULT false,
	"precision_m" integer DEFAULT 1,
	"content_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crown_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"transaction_type" text NOT NULL,
	"related_hunt_id" uuid,
	"related_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dig_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cache_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"dig_time" timestamp DEFAULT now() NOT NULL,
	"result" text NOT NULL,
	"crowns_spent" integer DEFAULT 0,
	"artefact_used" uuid
);
--> statement-breakpoint
CREATE TABLE "hunt_maps" (
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
CREATE TABLE "hunt_markers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"type" text NOT NULL,
	"lat" numeric NOT NULL,
	"lng" numeric NOT NULL,
	"label" text,
	"visible_to_users" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hunt_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "hunt_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"step_order" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"map_id" uuid,
	"validation_key_type" text NOT NULL,
	"validation_value" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hunts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"world_type" text NOT NULL,
	"mode" text NOT NULL,
	"status" text NOT NULL,
	"organizer_id" uuid NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"max_participants" integer,
	"fee_crowns" integer DEFAULT 0,
	"chat_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artefact_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"price_crowns" integer NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sold_at" timestamp,
	"buyer_id" uuid
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hunt_id" uuid NOT NULL,
	"type" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"image_url" text,
	"rarity" text,
	"value" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_artefacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"artefact_id" uuid NOT NULL,
	"obtained_at" timestamp DEFAULT now() NOT NULL,
	"source" text,
	"is_for_sale" boolean DEFAULT false,
	"sale_price" integer
);
--> statement-breakpoint
CREATE TABLE "user_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"reward_id" uuid NOT NULL,
	"obtained_at" timestamp DEFAULT now() NOT NULL,
	"hunt_id" uuid,
	"step_id" uuid
);
--> statement-breakpoint
CREATE TABLE "user_wallets" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"balance_crowns" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "caches" ADD CONSTRAINT "caches_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caches" ADD CONSTRAINT "caches_map_id_hunt_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."hunt_maps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "caches" ADD CONSTRAINT "caches_content_id_rewards_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."rewards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dig_actions" ADD CONSTRAINT "dig_actions_cache_id_caches_id_fk" FOREIGN KEY ("cache_id") REFERENCES "public"."caches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dig_actions" ADD CONSTRAINT "dig_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dig_actions" ADD CONSTRAINT "dig_actions_artefact_used_artefacts_id_fk" FOREIGN KEY ("artefact_used") REFERENCES "public"."artefacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_participants" ADD CONSTRAINT "hunt_participants_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_participants" ADD CONSTRAINT "hunt_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_steps" ADD CONSTRAINT "hunt_steps_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunt_steps" ADD CONSTRAINT "hunt_steps_map_id_hunt_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."hunt_maps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hunts" ADD CONSTRAINT "hunts_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_artefact_id_artefacts_id_fk" FOREIGN KEY ("artefact_id") REFERENCES "public"."artefacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_hunt_id_hunts_id_fk" FOREIGN KEY ("hunt_id") REFERENCES "public"."hunts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_step_id_hunt_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."hunt_steps"("id") ON DELETE no action ON UPDATE no action;