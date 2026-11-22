// app/api/cosxs/auth/presence/route.ts
// Presencia: cada teléfono manda un latido mientras tiene la app abierta. Se
// guarda la hora y se responde con el último latido de la pareja (la otra
// cuenta de la misma couple_id) y la hora del servidor, para que el teléfono
// no dependa de su reloj. Con { saliendo: true } se borra el latido propio.
import { Accounts, Sessions } from "@/app/repository/contracts/AccountRepository";
import { authError, authJson, authOptions, getBearerToken, hashToken } from "@/app/_libs/auth";

export const OPTIONS = async () => authOptions();

export const POST = async (request: Request) => {
  const token = getBearerToken(request);
  if (!token) return authError("Sesión caducada.", 401);

  let saliendo = false;
  try {
    const body = await request.json();
    saliendo = body?.saliendo === true;
  } catch {
    // Sin cuerpo: un latido normal.
  }

  try {
    const account = await Sessions.findAccount(hashToken(token));
    if (!account) return authError("Sesión caducada.", 401);

    const ahora = new Date();
    await Accounts.marcarVisto(account.id, saliendo ? null : ahora);

    const otro = account.quien === "cosi" ? "coso" : "cosi";
    const pareja = await Accounts.findByCouple(account.couple_id, otro);

    return authJson({
      pareja: pareja ? { quien: pareja.quien, visto_en: pareja.visto_en?.toISOString() ?? null } : null,
      ahora: ahora.toISOString(),
    });
  } catch (error) {
    console.error("Error en presencia:", error);
    return authError("No se pudo guardar la presencia.", 500);
  }
};
