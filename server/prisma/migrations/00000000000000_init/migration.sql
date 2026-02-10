-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create UUID v7 function
-- Based on the UUID v7 draft specification
CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
AS $$
DECLARE
  unix_ts_ms BIGINT;
  uuid_bytes BYTEA;
BEGIN
  unix_ts_ms = (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;

  uuid_bytes =
    substring(int8send(unix_ts_ms) from 3 for 6) ||
    gen_random_bytes(10);

  uuid_bytes = set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
  uuid_bytes = set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);

  RETURN encode(uuid_bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- CreateTable
CREATE TABLE "links" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v7(),
    "link" TEXT NOT NULL,
    "shortLink" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_accesses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v7(),
    "link_id" UUID NOT NULL,
    "accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_accesses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_shortLink_key" ON "links"("shortLink");

-- CreateIndex
CREATE INDEX "links_shortLink_idx" ON "links"("shortLink");

-- CreateIndex
CREATE INDEX "link_accesses_link_id_idx" ON "link_accesses"("link_id");

-- CreateIndex
CREATE INDEX "link_accesses_accessed_at_idx" ON "link_accesses"("accessed_at");

-- AddForeignKey
ALTER TABLE "link_accesses" ADD CONSTRAINT "link_accesses_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
