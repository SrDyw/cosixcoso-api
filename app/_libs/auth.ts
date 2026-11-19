// app/_libs/auth.ts
// Utilidades de las cuentas: contraseñas (scrypt), tokens de sesión,
// validación de datos y CORS para /api/cosxs/auth/*.
import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from "crypto";
import { NextResponse } from "next/server";
import type { AccountType, QuienType, UserType } from "@/app/types/cosxs";

// Las sesiones duran 180 días
export const SESSION_DAYS = 180;

// Parámetros de scrypt (N = 2^14, r = 8, p = 1 => ~16 MB de memoria)
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

const scryptAsync = (
  password: string,
  salt: Buffer,
  keyLength: number,
  options: { N: number; r: number; p: number }
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      keyLength,
      { ...options, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key))
    );
  });

// Devuelve "scrypt$N$r$p$sal$hash" (sal y hash en base64)
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  });

  return [
    "scrypt",
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
};

export const verifyPassword = async (
  password: string,
  stored: string
): Promise<boolean> => {
  try {
    const [algorithm, n, r, p, saltB64, hashB64] = stored.split("$");
    if (algorithm !== "scrypt" || !saltB64 || !hashB64) return false;

    const expected = Buffer.from(hashB64, "base64");
    const key = await scryptAsync(
      password,
      Buffer.from(saltB64, "base64"),
      expected.length,
      { N: Number(n), r: Number(r), p: Number(p) }
    );

    return key.length === expected.length && timingSafeEqual(key, expected);
  } catch (ex) {
    console.error("Error verifying password:", ex);
    return false;
  }
};

// Hash de una contraseña al azar: se compara contra él cuando el usuario no
// existe, para que el login tarde lo mismo exista o no.
let dummyHash: Promise<string> | null = null;
export const getDummyHash = (): Promise<string> => {
  if (!dummyHash) dummyHash = hashPassword(randomUUID());
  return dummyHash;
};

// Token de sesión: 32 bytes aleatorios en base64url. En la base solo se
// guarda su sha256 en hex.
export const generateToken = (): string => randomBytes(32).toString("base64url");

export const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

export const getSessionExpiration = (): Date =>
  new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

export const getBearerToken = (request: Request): string | null => {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const match = header.match(/^Bearer\s+(\S+)\s*$/i);
  return match ? match[1] : null;
};

export const generateCoupleId = (): string => `cosxs_id:${randomUUID()}`;

// ---- Validación ----

export const normalizeUsername = (username: unknown): string =>
  typeof username === "string" ? username.trim().toLowerCase() : "";

export const validateUsername = (username: string): string | null => {
  if (username.length < 3 || username.length > 24) {
    return "El nombre de usuario debe tener entre 3 y 24 caracteres.";
  }
  if (!/^[a-z0-9_.]+$/.test(username)) {
    return "El nombre de usuario solo puede tener letras, números, puntos y guiones bajos.";
  }
  return null;
};

export const validatePassword = (password: unknown): string | null => {
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return "La contraseña debe tener entre 8 y 128 caracteres.";
  }
  return null;
};

export const isQuien = (quien: unknown): quien is QuienType =>
  quien === "cosi" || quien === "coso";

export const toUser = (account: AccountType): UserType => ({
  id: account.id,
  username: account.username,
  quien: account.quien as QuienType,
  couple_id: account.couple_id,
  created_at: account.created_at.toISOString(),
});

// ---- CORS ----

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
  "Access-Control-Max-Age": "86400",
};

// Igual que NextResponse.json pero con las cabeceras de CORS
export const authJson = (body: unknown, status: number = 200) =>
  NextResponse.json(body, { status, headers: CORS_HEADERS });

export const authError = (error: string, status: number) =>
  authJson({ error }, status);

// Respuesta al preflight
export const authOptions = () =>
  new NextResponse(null, { status: 204, headers: CORS_HEADERS });
