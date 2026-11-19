-- CreateTable
CREATE TABLE "cosxs_messages" (
    "id" SERIAL NOT NULL,
    "sender" VARCHAR(100) NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "couple_id" VARCHAR(200) DEFAULT 'public',

    CONSTRAINT "cosxs_messages_pkey" PRIMARY KEY ("id")
);
