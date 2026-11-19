// repository/contracts/CharacterRepository.ts
import { CharacterType } from "@/app/types/cosxs";
import { wait } from "@/app/_libs/promiseUtils";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import IRepository from "./IRepository";

export default class CharacterRepository implements IRepository<CharacterType> {
  private _characters: SimpleORM<CharacterType>;
  private _development: boolean;

  constructor() {
    this._characters = new SimpleORM<CharacterType>("cosx_characters");
    this._development = true && process.env.NODE_ENV == "development";
  }

  async filter(filter: any): Promise<CharacterType[] | null> {
    if (this._development) {
      return (await this._characters.all()).filter(
        (x) =>
          (filter.id == undefined || x.id === filter.id) &&
          (filter.name == undefined || x.name === filter.name) && 
          (filter.cid == undefined || x.couple_id == filter.cid)
      );
    }
    
    var f: any = {};

    if (filter.id != undefined) f["id"] = filter.id;
    if (filter.name != undefined) f["name"] = filter.name;
    if (filter.cid != undefined) f["couple_id"] = filter.cid;
    
    return await prisma.character.findMany({
      where: f,
    });
  }

  async all(): Promise<CharacterType[]> {
    if (this._development) {
      await wait(1000);
      return await this._characters.all();
    }
    
    return await prisma.character.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async find(id: number): Promise<CharacterType | null> {
    if (this._development) {
      return await this._characters.find(id);
    }
    
    return await prisma.character.findUnique({
      where: { id },
    });
  }


  async create(
    characterData: Omit<CharacterType, "id">
  ): Promise<CharacterType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        return await this._characters.create(characterData as CharacterType);
      }

      return await prisma.character.create({
        data: {
          name: characterData.name,
          touches: characterData.touches,
          emoji: characterData.emoji,
          gender: characterData.gender,
          couple_id: characterData.couple_id
        },
      });
    } catch (ex) {
      console.error("Error creating character:", ex);
      return undefined;
    }
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._characters.remove(id);
    }

    try {
      const data = await prisma.character.delete({
        where: { id },
      });
      return data != null;
    } catch (ex) {
      console.error("Error deleting character:", ex);
      return false;
    }
  }

  async update(
    id: number,
    characterData: Partial<CharacterType>
  ): Promise<CharacterType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        const current = await this.find(id);
        if (!current) return undefined;

        const updated = { ...current, ...characterData, id };
        return await this._characters.update(id, updated);
      }

      return await prisma.character.update({
        where: { id },
        data: {
          name: characterData.name,
          touches: characterData.touches,
          emoji: characterData.emoji,
          gender: characterData.gender,
          couple_id: characterData.couple_id,
          id: characterData.id
        },
      });
    } catch (ex) {
      console.error("Error updating character:", ex);
      return undefined;
    }
  }

  async incrementTouches(id: number): Promise<CharacterType | undefined> {
    try {
      const character = await this.find(id);
      if (!character) return undefined;

      const updatedData = {
        touches: character.touches + 1
      };

      return await this.update(id, updatedData);
    } catch (ex) {
      console.error("Error incrementing touches:", ex);
      return undefined;
    }
  }
}

// Exporta una instancia única (singleton)
export const Characters: IRepository<CharacterType> = new CharacterRepository();