// app/api/cosxs/auth/register/route.ts
import { Accounts, Sessions } from "@/app/repository/contracts/AccountRepository";
import {
  authError,
  authJson,
  authOptions,
  generateCoupleId,
  hashPassword,
  isQuien,
  normalizeUsername,
  toUser,
  validatePassword,
  validateUsername,
} from "@/app/_libs/auth";

export const OPTIONS = async () => authOptions();

export const POST = async (request: Request) => {
  let body: Record<string, unknown> | null;
  try {
    body = await request.json();
  } catch {
    return authError("Datos no válidos.", 400);
  }

  if (!body || typeof body !== "object") {
    return authError("Datos no válidos.", 400);
  }

  const username = normalizeUsername(body.username);
  const usernameError = validateUsername(username);
  if (usernameError) return authError(usernameError, 400);

  const passwordError = validatePassword(body.password);
  if (passwordError) return authError(passwordError, 400);

  if (!isQuien(body.quien)) {
    return authError("Elige si eres Cosi o Coso.", 400);
  }

  // couple_id opcional: si viene, se une a esa pareja; si no, se crea una nueva
  let coupleId: string;
  if (body.couple_id === undefined || body.couple_id === null || body.couple_id === "") {
    coupleId = generateCoupleId();
  } else if (
    typeof body.couple_id !== "string" ||
    body.couple_id.trim().length === 0 ||
    body.couple_id.trim().length > 200
  ) {
    return authError("El código de pareja no es válido.", 400);
  } else {
    coupleId = body.couple_id.trim();
  }

  try {
    const result = await Accounts.create({
      username,
      password_hash: await hashPassword(body.password as string),
      quien: body.quien,
      couple_id: coupleId,
    });

    if (result.conflict === "username") {
      return authError("Ese nombre de usuario ya existe.", 409);
    }
    if (!result.account) {
      const nombre = body.quien === "cosi" ? "Cosi" : "Coso";
      return authError(`${nombre} ya tiene cuenta en esta pareja.`, 409);
    }

    const token = await Sessions.start(result.account.id);
    return authJson({ token, user: toUser(result.account) }, 201);
  } catch (error) {
    console.error("Error registering account:", error);
    return authError("No se pudo crear la cuenta. Inténtalo de nuevo.", 500);
  }
};
