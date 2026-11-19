-- CreateTable
CREATE TABLE "cosxs_todo " (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "due_date" VARCHAR(30),
    "user_id" VARCHAR(200),
    "couple_id" VARCHAR(200) DEFAULT 'public',
    "created_at" VARCHAR(30) NOT NULL,
    "updated_at" VARCHAR(30) NOT NULL,

    CONSTRAINT "cosxs_todo _pkey" PRIMARY KEY ("id")
);
