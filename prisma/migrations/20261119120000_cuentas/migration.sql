-- CreateTable
CREATE TABLE "cosxs_accounts" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(24) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "quien" VARCHAR(4) NOT NULL,
    "couple_id" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cosxs_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cosxs_sessions" (
    "id" SERIAL NOT NULL,
    "token_hash" VARCHAR(64) NOT NULL,
    "account_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cosxs_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cosxs_accounts_username_key" ON "cosxs_accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "cosxs_accounts_couple_id_quien_key" ON "cosxs_accounts"("couple_id", "quien");

-- CreateIndex
CREATE UNIQUE INDEX "cosxs_sessions_token_hash_key" ON "cosxs_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "cosxs_sessions_account_id_idx" ON "cosxs_sessions"("account_id");

-- AddForeignKey
ALTER TABLE "cosxs_sessions" ADD CONSTRAINT "cosxs_sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "cosxs_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

