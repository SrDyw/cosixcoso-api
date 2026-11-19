import { MediaType, MessageType } from "@/app/types/cosxs";
import { wait } from "@/app/_libs/promiseUtils";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import IRepository from "./IRepository";
import { GetDate, GetDateString } from "@/app/_libs/utils";

export default class MediaRepository implements IRepository<MediaType> {
  private _media: SimpleORM<MediaType>;
  private _development: boolean;

  constructor() {
    this._media = new SimpleORM<MediaType>("Media");
    this._development = true && process.env.NODE_ENV == "development";
  }

  isInDevelopmentMode = (): boolean => this._development;

  async filter(filter: any): Promise<MediaType[] | null> {
    if (this._development) {
      return (await this._media.all()).filter(
        (x) =>
          (filter.id == undefined || x.id == filter.id) &&
          (filter.cid == undefined || x.couple_id == filter.cid) &&
          (filter.key == undefined || x.key == filter.key) &&
          (x.date == null ||
            filter.from == undefined ||
            (filter.from as Date) <= x.date) &&
          (x.date == null ||
            filter.to == undefined ||
            (filter.to as Date) >= x.date)
      );
    }

    var whereClause: any = {};

    if (filter.key != undefined) whereClause["key"] = filter.key;
    if (filter.id != undefined) whereClause["id"] = filter.id;
    if (filter.cid != undefined) whereClause["couple_id"] = filter.cid;

    // Manejar filtros de fecha correctamente
    if (filter.from != undefined || filter.to != undefined) {
      whereClause.date = {};

      if (filter.from != undefined) {
        whereClause.date.gte = filter.from;
      }

      if (filter.to != undefined) {
        whereClause.date.lte = filter.to;
      }
    }

    return await prisma.media.findMany({
      where: whereClause,
    });
  }
  async all(): Promise<MediaType[]> {
    if (this._development) {
      await wait(1000);
      return await this._media.all();
    }

    return await prisma.media.findMany();
  }

  async find(id: number): Promise<MediaType | null> {
    if (this._development) {
      return await this._media.find(id);
    }

    return await prisma.media.findUnique({
      where: { id },
    });
  }

  async create(
    mediaData: Omit<MediaType, "id" | "created_at">
  ): Promise<MediaType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        return await this._media.create(mediaData as MediaType);
      }
      return await prisma.media.create({
        data: {
          key: mediaData.key,
          url: mediaData.url,
          url2: mediaData.url2,
          created_at: GetDateString(new Date()),
          couple_id: mediaData.couple_id,
          date: mediaData.date,
          description: mediaData.description,
          date_string: GetDateString(mediaData.date ?? new Date()),
          ubication: mediaData.ubication,
        },
      });
    } catch (ex) {
      console.error("Error creating message:", ex);
      return undefined;
    }
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._media.remove(id);
    }

    try {
      const data = await prisma.media.delete({
        where: { id },
      });
      return data != null;
    } catch (ex) {
      console.error("Error deleting message:", ex);
      return false;
    }
  }

  async update(
    id: number,
    messageData: { description: string; date_string: string; ubication: string, url?: string, secureUrl?: string, public_id?:string }
  ): Promise<MediaType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        const current = await this._media.find(id);
        if (!current) return undefined;

        const updated = { 
          ...current, 
          ...messageData, 
          date: GetDate(messageData.date_string),
          id 
        };
        return await this._media.update(id, updated);
      }
      let updatedObj : any = {
        description: messageData.description,
        date_string: messageData.date_string,
        date: GetDate(messageData.date_string),
        ubication: messageData.ubication,
      };

      if (messageData.url != null) updatedObj["url"] = messageData.url;
      if (messageData.secureUrl != null) updatedObj["url2"] = messageData.secureUrl;
      if (messageData.secureUrl != null) updatedObj["public_id"] = messageData.public_id;

      console.log(updatedObj);

      return await prisma.media.update({
        where: { id },
        data: updatedObj,
      });
    } catch (ex) {
      console.error("Error updating media:", ex);
      return undefined;
    }
  }
}

// Exporta una instancia única (singleton)
export const Media: IRepository<MediaType> = new MediaRepository();
