-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_type" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "user_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "selling_value" DOUBLE PRECISION NOT NULL,
    "renting_value" DOUBLE PRECISION NOT NULL,
    "tax_value" DOUBLE PRECISION NOT NULL,
    "coordinates" geometry(Point, 4326) NOT NULL,

    CONSTRAINT "real_estate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "author_id" UUID NOT NULL,
    "realEstate_id" UUID NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "author_id" UUID NOT NULL,
    "realEstate_id" UUID NOT NULL,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "author_id" UUID NOT NULL,
    "realEstate_id" UUID NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estate_photo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "realEstate_id" UUID NOT NULL,

    CONSTRAINT "real_estate_photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_document_key" ON "user"("document");

-- CreateIndex
CREATE UNIQUE INDEX "user_type_type_key" ON "user_type"("type");

-- CreateIndex
CREATE INDEX "location_idx" ON "real_estate" USING GIST ("coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "listing_realEstate_id_key" ON "listing"("realEstate_id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "user_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_realEstate_id_fkey" FOREIGN KEY ("realEstate_id") REFERENCES "real_estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead" ADD CONSTRAINT "lead_realEstate_id_fkey" FOREIGN KEY ("realEstate_id") REFERENCES "real_estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_realEstate_id_fkey" FOREIGN KEY ("realEstate_id") REFERENCES "real_estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate_photo" ADD CONSTRAINT "real_estate_photo_realEstate_id_fkey" FOREIGN KEY ("realEstate_id") REFERENCES "real_estate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;