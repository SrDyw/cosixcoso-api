-- Presencia: último latido de la app abierta de cada cuenta. Solo añade una
-- columna que admite nulos; no toca datos existentes.
ALTER TABLE "cosxs_accounts" ADD COLUMN "visto_en" TIMESTAMP(3);
