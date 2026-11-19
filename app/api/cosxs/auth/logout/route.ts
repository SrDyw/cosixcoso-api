// app/api/cosxs/auth/logout/route.ts
import { Sessions } from "@/app/repository/contracts/AccountRepository";
import {
  authError,
  authJson,
  authOptions,
  getBearerToken,
  hashToken,
} from "@/app/_libs/auth";

export const OPTIONS = async () => authOptions();

export const POST = async (request: Request) => {
  const token = getBearerToken(request);
  if (!token) return authError("Sesión caducada.", 401);

  try {
    const tokenHash = hashToken(token);

    // Solo se cierra si la sesión existe y no ha caducado
    if (!(await Sessions.findAccount(tokenHash))) {
      return authError("Sesión caducada.", 401);
    }

    await Sessions.remove(tokenHash);
    return authJson({ ok: true });
  } catch (error) {
    console.error("Error logging out:", error);
    return authError("No se pudo cerrar la sesión. Inténtalo de nuevo.", 500);
  }
};
