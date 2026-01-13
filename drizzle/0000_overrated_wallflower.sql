CREATE TYPE "public"."provider" AS ENUM('email', 'google');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"provider" "provider" DEFAULT 'email' NOT NULL,
	"googleId" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
