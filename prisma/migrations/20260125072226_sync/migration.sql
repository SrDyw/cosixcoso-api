-- CreateTable
CREATE TABLE "cosx_events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_date" VARCHAR(30) NOT NULL,
    "end_date" VARCHAR(30) NOT NULL,
    "color" VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
    "user_id" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cosx_events_pkey" PRIMARY KEY ("id")
);
