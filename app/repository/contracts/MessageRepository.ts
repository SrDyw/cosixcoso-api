import { MessageType } from "@/app/types/cosxs";
import { wait } from "@/app/_libs/promiseUtils";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import IRepository from "./IRepository";

export default class MessageRepository implements IRepository<MessageType> {
  private _messages: SimpleORM<MessageType>;
  private _development: boolean;

  constructor() {
    this._messages = new SimpleORM<MessageType>("cosxs_messages");
    this._development = true && process.env.NODE_ENV == "development";
  }

  async filter(filter: any): Promise<MessageType[] | null> {
    if (this._development) {
      return (await this._messages.all()).filter(
        (x) =>
          (filter.id == undefined || x.id == filter.id) &&
          (filter.couple_id == undefined || x.couple_id == filter.couple_id) &&
          (filter.sender == undefined || x.sender === filter.sender)
      );
    }
    
    var f: any = {};

    if (filter.couple_id != undefined) f["couple_id"] = filter.couple_id;
    if (filter.id != undefined) f["id"] = filter.id;
    if (filter.sender != undefined) f["sender"] = filter.sender;
    return await prisma.cosxMessage.findMany({
      where: f,
      orderBy: {
        created_at: "asc",
      },
    });
  }

  async all(): Promise<MessageType[]> {
    if (this._development) {
      await wait(1000);
      return await this._messages.all();
    }
    
    return await prisma.cosxMessage.findMany({
      orderBy: {
        created_at: "asc",
      },
    });
  }

  async find(id: number): Promise<MessageType | null> {
    if (this._development) {
      return await this._messages.find(id);
    }
    
    return await prisma.cosxMessage.findUnique({
      where: { id },
    });
  }

  async create(
    messageData: Omit<MessageType, "id">
  ): Promise<MessageType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        return await this._messages.create(messageData as MessageType);
      }
      return await prisma.cosxMessage.create({
        data: {
          sender: messageData.sender,
          message: messageData.message,
          couple_id: messageData.couple_id,
          created_at: messageData.created_at
        },
      });
    } catch (ex) {
      console.error("Error creating message:", ex);
      return undefined;
    }
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._messages.remove(id);
    }

    try {
      const data = await prisma.cosxMessage.delete({
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
    messageData: Partial<MessageType>
  ): Promise<MessageType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        const current = await this._messages.find(id);
        if (!current) return undefined;

        const updated = { ...current, ...messageData, id };
        return await this._messages.update(id, updated);
      }

      return await prisma.cosxMessage.update({
        where: { id },
        data: {
          message: messageData.message,
          sender: messageData.sender,
          couple_id: messageData.couple_id,
        },
      });
    } catch (ex) {
      console.error("Error updating message:", ex);
      return undefined;
    }
  }
}

// Exporta una instancia única (singleton)
export const Messages: IRepository<MessageType> = new MessageRepository();