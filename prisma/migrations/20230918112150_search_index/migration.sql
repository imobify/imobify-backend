-- CreateIndex
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "real_estate_search_idx" ON "real_estate" USING GIN ("search" gin_trgm_ops);
