-- CreateTable
CREATE TABLE "characters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "touches" INTEGER NOT NULL DEFAULT 0,
    "emoji" INTEGER NOT NULL DEFAULT 1,
    "gender" VARCHAR(1) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "characters_name_key" ON "characters"("name");
