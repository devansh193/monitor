CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "websites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"monitoring_interval_seconds" integer DEFAULT 10 NOT NULL,
	"http_method" varchar(10) DEFAULT 'GET' NOT NULL,
	"http_headers" jsonb,
	"request_body" text,
	"expected_response_code" integer DEFAULT 200 NOT NULL,
	"expected_response_body" varchar(500),
	"timeout_seconds" integer DEFAULT 10 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_check_at" timestamp with time zone DEFAULT now(),
	"last_status" varchar(10),
	"status_changed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"email_notifications_enable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "uptime_check" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"website_id" uuid NOT NULL,
	"checked_at" timestamp with time zone,
	"is_up" boolean NOT NULL,
	"http_status_code" integer,
	"response_time_ms" integer,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "https_monitor_configs" (
	"monitor_id" uuid NOT NULL,
	"http_method" varchar(10) DEFAULT 'GET' NOT NULL,
	"http_headers" jsonb,
	"request_body" text,
	"expected_response_code" integer DEFAULT 200,
	"expected_response_body" varchar(500),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "websites" ADD CONSTRAINT "websites_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uptime_check" ADD CONSTRAINT "uptime_check_website_id_websites_id_fk" FOREIGN KEY ("website_id") REFERENCES "public"."websites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "https_monitor_configs" ADD CONSTRAINT "https_monitor_configs_monitor_id_websites_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."websites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_websites_user_id" ON "websites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_websites_is_active" ON "websites" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_websites_url" ON "websites" USING btree ("url","user_id");--> statement-breakpoint
CREATE INDEX "website_id_checked_idx" ON "uptime_check" USING btree ("checked_at","website_id");--> statement-breakpoint
CREATE INDEX "checked_at_idx" ON "uptime_check" USING btree ("checked_at");--> statement-breakpoint
CREATE INDEX "idx_https_configs_monitor_id" ON "https_monitor_configs" USING btree ("monitor_id");

-- function for INSERT
CREATE OR REPLACE FUNCTION notify_website_insert()
RETURNS trigger AS $$
BEGIN
	PERFORM pg_notify('website_inserts', NEW.id::text);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for INSERT
CREATE TRIGGER website_insert_trigger
AFTER INSERT ON websites
FOR EACH ROW EXECUTE FUNCTION notify_website_insert();

-- function for UPDATE
CREATE OR REPLACE FUNCTION notify_website_update()
RETURNS trigger AS $$
BEGIN
	PERFORM pg_notify('website_updates', NEW.id::text);
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for UPDATE
CREATE TRIGGER website_update_trigger
AFTER UPDATE ON websites
FOR EACH ROW EXECUTE FUNCTION notify_website_update();

-- function for DELETE
CREATE OR REPLACE FUNCTION notify_website_delete()
RETURNS trigger AS $$
BEGIN
	PERFORM pg_notify('website_deletes', OLD.id::text);
	RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for DELETE
CREATE TRIGGER website_delete_trigger
AFTER DELETE ON websites
FOR EACH ROW EXECUTE FUNCTION notify_website_delete();