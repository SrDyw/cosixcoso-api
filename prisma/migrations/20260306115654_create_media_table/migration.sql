-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(30) NOT NULL,
    "url" TEXT NOT NULL,
    "url2" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_key_key" ON "Media"("key");
