import { ImageType, QuestionAnswer } from "@/app/types/cosxs";
import IRepository from "./IRepository";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import { wait } from "@/app/_libs/promiseUtils";
import { GetDateString } from "@/app/_libs/utils";

export default class DevImageRepository implements IRepository<ImageType> {
  private _images: SimpleORM<ImageType>;
  private _development: boolean;

  constructor() {
    this._development = process.env.NODE_ENV == "development";
    this._images = new SimpleORM<ImageType>("Images");
  }

  async all(): Promise<ImageType[]> {
    return await this._images.all();
  }

  async filter(filter: any): Promise<ImageType[] | null> {
    return (await this._images.all()).filter(
      (x) =>
        (filter.id == undefined || x.id == filter.id) &&
        (filter.key == undefined || x.key == filter.key) &&
        (filter.cid == undefined || x.couple_id == filter.cid)
    );
  }
  async create(
    imageData: Omit<ImageType, "id" | "create_at">
  ): Promise<ImageType | undefined> {
    try {
      const now = GetDateString(new Date());
      if (this._development) {
        await wait(1000);
        const imageWithDates = {
          ...imageData,
          created_at: now,
        } as ImageType;
        return await this._images.create(imageWithDates);
      }
    } catch (ex) {
      console.error("Error creating answer:", ex);
      return undefined;
    }
  }

  find(id: number): Promise<ImageType | null> {
    throw new Error("Method not implemented.");
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._images.remove(id);
    }
    return false;
  }

  async removeByKey(key: string): Promise<boolean> {
    if (this._development) {
      var targetImage = (await this._images.all()).find((x) => x.key == key);

      if (targetImage != null) {
        return await this._images.remove(targetImage.id ?? -1);
      }
    }
    return false;
  }
}

export const ImageRepository: IRepository<ImageType> = new DevImageRepository();
