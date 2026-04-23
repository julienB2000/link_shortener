CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"short_code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code")
);
