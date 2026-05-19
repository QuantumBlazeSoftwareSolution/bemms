CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'TECHNICIAN', 'CLINICAL');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('OPERATIONAL', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE');--> statement-breakpoint
CREATE TYPE "public"."fault_status" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."task_type" AS ENUM('PREVENTIVE', 'CALIBRATION', 'REPAIR');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'CLINICAL' NOT NULL,
	"specialty" text,
	"status" text DEFAULT 'Available' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"model" text NOT NULL,
	"serial_number" text NOT NULL,
	"department" text NOT NULL,
	"supplier" text NOT NULL,
	"status" "asset_status" DEFAULT 'OPERATIONAL' NOT NULL,
	"last_maintenance" text NOT NULL,
	"next_calibration" text NOT NULL,
	"maintenance_frequency" text NOT NULL,
	"qr_code_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fault_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"priority" "priority" DEFAULT 'MEDIUM' NOT NULL,
	"status" "fault_status" DEFAULT 'OPEN' NOT NULL,
	"submitted_by" text NOT NULL,
	"submitted_at" text NOT NULL,
	"department" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"technician_id" uuid,
	"type" "task_type" NOT NULL,
	"scheduled_date" text NOT NULL,
	"completed_date" text,
	"status" "task_status" DEFAULT 'PENDING' NOT NULL,
	"priority" "priority" DEFAULT 'MEDIUM' NOT NULL,
	"time_spent" text,
	"spare_parts" text,
	"notes" text,
	"cost_saved" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"user" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fault_reports" ADD CONSTRAINT "fault_reports_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_tasks" ADD CONSTRAINT "maintenance_tasks_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_tasks" ADD CONSTRAINT "maintenance_tasks_technician_id_users_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;