// repository/contracts/AccountRepository.ts
// Cuentas y sesiones. Siempre van contra Prisma (también en desarrollo):
// no hay versión de SimpleORM para estas tablas.
import { AccountType } from "@/app/types/cosxs";
import {
  generateToken,
  getSessionExpiration,
  hashToken,
} from "@/app/_libs/auth";
import { prisma } from "@/libs/prisma";

export type CreateAccountResult =
  | { account: AccountType; conflict?: undefined }
  | { account?: undefined; conflict: "username" | "quien" };

export default class AccountRepository {
  async findByUsername(username: string): Promise<AccountType | null> {
    return await prisma.account.findUnique({
      where: { username },
    });
  }

  async findByCouple(
    couple_id: string,
    quien: string
  ): Promise<AccountType | null> {
    return await prisma.account.findUnique({
      where: { couple_id_quien: { couple_id, quien } },
    });
  }

  // Crea la cuenta comprobando antes los únicos. Si dos registros llegan a
  // la vez, el índice único de la base decide y se informa del conflicto.
  async create(
    accountData: Omit<AccountType, "id" | "created_at">
  ): Promise<CreateAccountResult> {
    if (await this.findByUsername(accountData.username)) {
      return { conflict: "username" };
    }
    if (await this.findByCouple(accountData.couple_id, accountData.quien)) {
      return { conflict: "quien" };
    }

    try {
      const account = await prisma.account.create({
        data: {
          username: accountData.username,
          password_hash: accountData.password_hash,
          quien: accountData.quien,
          couple_id: accountData.couple_id,
        },
      });
      return { account };
    } catch (ex) {
      if ((ex as { code?: string })?.code === "P2002") {
        if (await this.findByUsername(accountData.username)) {
          return { conflict: "username" };
        }
        return { conflict: "quien" };
      }
      throw ex;
    }
  }

  // Presencia: guarda el último latido de la cuenta (o lo borra al despedirse).
  async marcarVisto(id: number, visto: Date | null): Promise<void> {
    await prisma.account.update({ where: { id }, data: { visto_en: visto } });
  }
}

export class SessionRepository {
  // Abre una sesión nueva y devuelve el token (en la base solo queda su hash)
  async start(account_id: number): Promise<string> {
    const token = generateToken();
    await this.create(account_id, hashToken(token), getSessionExpiration());
    return token;
  }

  async create(
    account_id: number,
    token_hash: string,
    expires_at: Date
  ): Promise<void> {
    await prisma.session.create({
      data: { account_id, token_hash, expires_at },
    });
  }

  // Devuelve la cuenta de una sesión válida (existe y no ha caducado)
  async findAccount(token_hash: string): Promise<AccountType | null> {
    const session = await prisma.session.findUnique({
      where: { token_hash },
      include: { account: true },
    });

    if (!session) return null;

    if (session.expires_at.getTime() <= Date.now()) {
      await this.remove(token_hash);
      return null;
    }

    return session.account;
  }

  async remove(token_hash: string): Promise<boolean> {
    const result = await prisma.session.deleteMany({
      where: { token_hash },
    });
    return result.count > 0;
  }
}

// Instancias únicas (singleton)
export const Accounts = new AccountRepository();
export const Sessions = new SessionRepository();
