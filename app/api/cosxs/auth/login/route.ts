// app/api/cosxs/auth/login/route.ts
import { Accounts, Sessions } from "@/app/repository/contracts/AccountRepository";
import {
  authError,
  authJson,
  authOptions,
  getDummyHash,
  normalizeUsername,
  toUser,
  verifyPassword,
} from "@/app/_libs/auth";

const LOGIN_ERROR = "Usuario o contraseña incorrectos.";

export const OPTIONS = async () => authOptions();

export const POST = async (request: Request) => {
  let body: Record<string, unknown> | null;
  try {
    body = await request.json();
  } catch {
    return authError("Datos no válidos.", 400);
  }

  const username = normalizeUsername(body?.username);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return authError(LOGIN_ERROR, 401);
  }

  try {
    const account = await Accounts.findByUsername(username);

    // Se compara siempre (aunque no exista el usuario) para no dar pistas
    const valid = await verifyPassword(
      password,
      account ? account.password_hash : await getDummyHash()
    );

    if (!account || !valid) {
      return authError(LOGIN_ERROR, 401);
    }

    const token = await Sessions.start(account.id);
    return authJson({ token, user: toUser(account) });
  } catch (error) {
    console.error("Error logging in:", error);
    return authError("No se pudo iniciar sesión. Inténtalo de nuevo.", 500);
  }
};
