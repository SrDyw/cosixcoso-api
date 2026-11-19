import { wait } from "@/app/_libs/promiseUtils";
import IRepository from "./IRepository";
import { JournalType } from "@/app/types/cosxs";
import { query } from "@/app/_libs/pg";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";

export default class JournalRepository implements IRepository<JournalType> {
  private _journals: SimpleORM<JournalType>;
  private _development: boolean;

  constructor() {
    this._journals = new SimpleORM<JournalType>("cosx_journals");
    this._development = process.env.NODE_ENV == "development";
  }

  async filter(filter: any): Promise<JournalType[] | null> {
    if (this._development) {
      return (await this._journals.all()).filter(
        (x) =>
          (filter.id == undefined || x.id == filter.id) &&
          (filter.cid == undefined || x.couple_id == filter.cid)
      );
    }
    var f: any = {};

    if (filter.cid != undefined) f["couple_id"] = filter.cid;
    if (filter.id != undefined) f["id"] = filter.id;

    return await prisma.journal.findMany({
      where: f,
    });
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._journals.remove(id);
    }
    var data = await prisma.journal.delete({
      where: {
        id,
      },
    });
    console.log(data);
    return data != null;
  }

  async all(): Promise<JournalType[] | any> {
    if (this._development) {
      await wait(1000);
      return await this._journals.all();
    }
    return await prisma.journal.findMany();
  }
  async find(id: number): Promise<JournalType | null> {
    if (this._development) {
      return await this._journals.find(id);
    }
    return await prisma.journal.findFirst({
      where: {
        id,
      },
    });
  }
  async create(journal: JournalType): Promise<JournalType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        return await this._journals.create(journal);
      }
      return await prisma.journal.create({
        data: journal,
      });
    } catch (ex) {
      console.log(ex);
      return undefined;
    }
  }

  async count(): Promise<number> {
    if (this._development)
    {
      return await this._journals.count();
    }
    return await prisma.journal.count();
  }
}

// Con su tipo propio: además de IRepository tiene count() (general/datacount).
export const Journals = new JournalRepository();
