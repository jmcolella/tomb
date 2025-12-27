-- CreateTable
CREATE TABLE "public"."books" (
    "sid" VARCHAR NOT NULL,
    "creation_order_id" INTEGER NOT NULL,
    "datetime_created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_updated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "library_sid" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "total_pages" INTEGER,
    "status" VARCHAR NOT NULL,
    "author_name" VARCHAR NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("sid")
);

-- Create sequence for books.creation_order_id
CREATE SEQUENCE IF NOT EXISTS "books_creation_order_id_seq";
ALTER TABLE "public"."books" 
  ALTER COLUMN "creation_order_id" SET DEFAULT nextval('books_creation_order_id_seq');
ALTER SEQUENCE "books_creation_order_id_seq" OWNED BY "public"."books"."creation_order_id";

-- CreateTable
CREATE TABLE "public"."book_events" (
    "sid" VARCHAR NOT NULL,
    "creation_order_id" INTEGER NOT NULL,
    "datetime_created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_updated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "book_sid" VARCHAR NOT NULL,
    "event_type" VARCHAR NOT NULL,
    "date_effective" DATE NOT NULL,
    "page_number" INTEGER,
    "version" INTEGER NOT NULL,

    CONSTRAINT "book_events_pkey" PRIMARY KEY ("sid")
);

-- Create sequence for book_events.creation_order_id
CREATE SEQUENCE IF NOT EXISTS "book_events_creation_order_id_seq";
ALTER TABLE "public"."book_events" 
  ALTER COLUMN "creation_order_id" SET DEFAULT nextval('book_events_creation_order_id_seq');
ALTER SEQUENCE "book_events_creation_order_id_seq" OWNED BY "public"."book_events"."creation_order_id";

-- CreateTable
CREATE TABLE "public"."book_event_versions" (
    "sid" VARCHAR NOT NULL,
    "creation_order_id" INTEGER NOT NULL,
    "datetime_created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "datetime_updated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "book_sid" VARCHAR NOT NULL,
    "version" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "book_event_versions_pkey" PRIMARY KEY ("sid")
);

-- Create sequence for book_event_versions.creation_order_id
CREATE SEQUENCE IF NOT EXISTS "book_event_versions_creation_order_id_seq";
ALTER TABLE "public"."book_event_versions" 
  ALTER COLUMN "creation_order_id" SET DEFAULT nextval('book_event_versions_creation_order_id_seq');
ALTER SEQUENCE "book_event_versions_creation_order_id_seq" OWNED BY "public"."book_event_versions"."creation_order_id";

