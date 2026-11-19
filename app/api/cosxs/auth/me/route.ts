// app/api/cosxs/auth/me/route.ts
import { Sessions } from "@/app/repository/contracts/AccountRepository";
import {
  authError,
  authJson,
  authOptions,
  getBearerToken,
  hashToken,
  toUser,
} from "@/app/_libs/auth";

export const OPTIONS = async () => authOptions();

export const GET = async (request: Request) => {
  const token = getBearerToken(request);
  if (!token) return authError("Sesión caducada.", 401);

  try {
    const account = await Sessions.findAccount(hashToken(token));
    if (!account) return authError("Sesión caducada.", 401);

    return authJson({ user: toUser(account) });
  } catch (error) {
    console.error("Error reading session:", error);
    return authError("No se pudo comprobar la sesión. Inténtalo de nuevo.", 500);
  }
};
