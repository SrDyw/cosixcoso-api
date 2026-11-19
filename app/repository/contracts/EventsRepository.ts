import { EventType } from "@/app/types/cosxs";
import { wait } from "@/app/_libs/promiseUtils";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import IRepository from "./IRepository";

export default class EventRepository implements IRepository<EventType> {
  private _events: SimpleORM<EventType>;
  private _development: boolean;

  constructor() {
    this._events = new SimpleORM<EventType>("cosx_events");
    this._development = true && process.env.NODE_ENV == "development";
  }
  async filter(filter: any): Promise<EventType[] | null> {
    console.log("using filter func");
    if (this._development) {
      return (await this._events.all()).filter(
        (x) =>
          (filter.id == undefined || x.id == filter.id) &&
          (filter.cid == undefined || x.couple_id == filter.cid)
      );
    }
    var f: any = {};

    if (filter.cid != undefined) f["couple_id"] = filter.cid;
    if (filter.id != undefined) f["id"] = filter.id;
    console.log("using prisma");
    return await prisma.cosxEvent.findMany({
      where: f,
    });
  }

  async all(): Promise<EventType[]> {
    if (this._development) {
      await wait(1000);
      return await this._events.all();
    }
    // @ts-ignore
    return await prisma.cosxEvent.findMany({
      orderBy: {
        start_date: "asc",
      },
    });
  }

  async find(id: number): Promise<EventType | null> {
    if (this._development) {
      return await this._events.find(id);
    }
    // @ts-ignore
    return await prisma.cosxEvent.findUnique({
      where: { id },
    });
  }

  async create(
    eventData: Omit<EventType, "id" | "createdAt">
  ): Promise<EventType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        return await this._events.create(eventData as EventType);
      }
      var request : EventType = {
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          color: eventData.color,
          user_id: eventData.user_id,
          couple_id: eventData.couple_id
        };
        

      return await prisma.cosxEvent.create({
        data: request,
      });
    } catch (ex) {
      console.error("Error creating event:", ex);
      return undefined;
    }
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._events.remove(id);
    }

    try {
      // @ts-ignore
      const data = await prisma.cosxEvent.delete({
        where: { id },
      });
      return data != null;
    } catch (ex) {
      console.error("Error deleting event:", ex);
      return false;
    }
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    userId?: string
  ): Promise<EventType[]> {
    if (this._development) {
      const allEvents = await this._events.all();
      return allEvents.filter((event) => {
        const matchesDate =
          event.start_date >= startDate && event.start_date <= endDate;
        const matchesUser = !userId || event.user_id === userId;
        return matchesDate && matchesUser;
      });
    }

    const whereClause: any = {
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) {
      whereClause.userId = userId;
    }
    // @ts-ignore
    return await prisma.cosxEvent.findMany({
      where: whereClause,
      orderBy: { start_date: "asc" },
    });
  }

  async update(
    id: number,
    eventData: Partial<EventType>
  ): Promise<EventType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        const current = await this._events.find(id);
        if (!current) return undefined;

        const updated = { ...current, ...eventData, id };
        return await this._events.update(id, updated);
      }

      // @ts-ignore
      return await prisma.cosxEvent.update({
        where: { id },
        data: {
          title: eventData.title,
          description: eventData.description,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          color: eventData.color,
          user_id: eventData.user_id,
        },
      });
    } catch (ex) {
      console.error("Error updating event:", ex);
      return undefined;
    }
  }
}

// Exporta una instancia única (singleton)
export const Events: IRepository<EventType> = new EventRepository();
