ALTER TABLE "assets" ADD COLUMN "qr_code" text;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_qr_code_unique" UNIQUE("qr_code");
