-- CreateTable
CREATE TABLE "public"."libraries" (
    "sid" VARCHAR NOT NULL,
    "creation_order_id" INTEGER NOT NULL,
    "datetime_created" TIMESTAMPTZ(6),
    "datetime_updated" TIMESTAMPTZ(6),
    "user_sid" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "libraries_pkey" PRIMARY KEY ("sid")
);

