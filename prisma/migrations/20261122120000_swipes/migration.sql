CREATE TABLE "cosxs_swipes" (
    "id" SERIAL NOT NULL,
    "card_id" INTEGER NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "couple_id" VARCHAR(200) NOT NULL,
    "choice" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cosxs_swipes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cosxs_swipes_couple_id_card_id_user_id_key" ON "cosxs_swipes"("couple_id", "card_id", "user_id");
CREATE INDEX "cosxs_swipes_couple_id_idx" ON "cosxs_swipes"("couple_id");
