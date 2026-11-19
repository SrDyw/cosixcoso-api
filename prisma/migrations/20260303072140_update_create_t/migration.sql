-- CreateTable
CREATE TABLE "cosxs_qanswer " (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "user_id" VARCHAR(200),
    "couple_id" VARCHAR(200) DEFAULT 'public',
    "created_at" VARCHAR(30) NOT NULL,

    CONSTRAINT "cosxs_qanswer _pkey" PRIMARY KEY ("id")
);
