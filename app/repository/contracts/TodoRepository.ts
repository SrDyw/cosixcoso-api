// repository/contracts/TodoRepository.ts
import { TodoType } from "@/app/types/cosxs";
import { wait } from "@/app/_libs/promiseUtils";
import { SimpleORM } from "@/app/_libs/simpleORM";
import { prisma } from "@/libs/prisma";
import IRepository from "./IRepository";

export default class TodoRepository implements IRepository<TodoType> {
  private _todos: SimpleORM<TodoType>;
  private _development: boolean;

  constructor() {
    this._todos = new SimpleORM<TodoType>("cosxs_todo");
    this._development = true && process.env.NODE_ENV == "development";
  }

  async filter(filter: any): Promise<TodoType[] | null> {
    if (this._development) {
      return (await this._todos.all()).filter(
        (x) =>
          (filter.id == undefined || x.id === filter.id) &&
          (filter.couple_id == undefined || x.couple_id === filter.couple_id) &&
          (filter.user_id == undefined || x.user_id === filter.user_id) &&
          (filter.completed == undefined || x.completed === filter.completed)
      );
    }

    var f: any = {};

    if (filter.couple_id != undefined) f["couple_id"] = filter.couple_id;
    if (filter.user_id != undefined) f["user_id"] = filter.user_id;
    if (filter.id != undefined) f["id"] = filter.id;
    if (filter.completed != undefined) f["completed"] = filter.completed;

    return await prisma.todoList.findMany({
      where: f,
    });
  }

  async all(): Promise<TodoType[]> {
    if (this._development) {
      await wait(1000);
      return await this._todos.all();
    }

    return await prisma.todoList.findMany();
  }

  async find(id: number): Promise<TodoType | null> {
    if (this._development) {
      return await this._todos.find(id);
    }

    return await prisma.todoList.findUnique({
      where: { id },
    });
  }

  async create(
    todoData: Omit<TodoType, "id" | "created_at" | "updated_at">
  ): Promise<TodoType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        const now = new Date().toISOString().split("T")[0];
        const todoWithDates = {
          ...todoData,
          created_at: now,
          updated_at: now,
        } as TodoType;
        return await this._todos.create(todoWithDates);
      }

      const now = new Date().toISOString().split("T")[0];
      return await prisma.todoList.create({
        data: {
          description: todoData.description || "No description provided",
          completed: todoData.completed || false,
          color: todoData.color || "#fff",
          due_date: todoData.due_date || null,
          user_id: todoData.user_id || null,
          couple_id: todoData.couple_id || null,
          created_at: now,
          updated_at: now,
        },
      });
    } catch (ex) {
      console.error("Error creating todo:", ex);
      return undefined;
    }
  }

  async remove(id: number): Promise<boolean> {
    if (this._development) {
      return await this._todos.remove(id);
    }

    try {
      const data = await prisma.todoList.delete({
        where: { id },
      });
      return data != null;
    } catch (ex) {
      console.error("Error deleting todo:", ex);
      return false;
    }
  }

  async update(
    id: number,
    todoData: Partial<TodoType>
  ): Promise<TodoType | undefined> {
    try {
      if (this._development) {
        await wait(1000);
        const current = await this.find(id);
        if (!current) return undefined;

        const updated = {
          ...current,
          ...todoData,
          id,
          updated_at: new Date().toISOString().split("T")[0],
        };
        return await this._todos.update(id, updated);
      }

      const now = new Date().toISOString().split("T")[0];
      return await prisma.todoList.update({
        where: { id },
        data: {
          description: todoData.description || "No description provided",
          completed: todoData.completed,
          color: todoData.color,
          due_date: todoData.due_date,
          user_id: todoData.user_id,
          couple_id: todoData.couple_id,
          updated_at: now,
        },
      });
    } catch (ex) {
      console.error("Error updating todo:", ex);
      return undefined;
    }
  }

  async setCompleteState(
    id: number,
    value: boolean
  ): Promise<TodoType | undefined> {
    try {
      const todo = await this.find(id);
      if (!todo) return undefined;

      return await this.update(id, {
        completed: value,
        updated_at: new Date().toDateString(),
      });
    } catch (ex) {
      console.error("Error toggling todo:", ex);
      return undefined;
    }
  }

  async findByCoupleId(couple_id: string): Promise<TodoType[]> {
    if (this._development) {
      const allTodos = await this._todos.all();
      return allTodos.filter((todo) => todo.couple_id === couple_id);
    }

    return await prisma.todoList.findMany({
      where: { couple_id },
    });
  }

  async findByUserId(user_id: string): Promise<TodoType[]> {
    if (this._development) {
      const allTodos = await this._todos.all();
      return allTodos.filter((todo) => todo.user_id === user_id);
    }

    return await prisma.todoList.findMany({
      where: { user_id },
    });
  }
}

// Exporta una instancia única (singleton)
export const Todos: IRepository<TodoType> = new TodoRepository();
