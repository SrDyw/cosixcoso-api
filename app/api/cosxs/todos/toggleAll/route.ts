// app/api/todos/[id]/toggle/route.ts
import TodoRepository, {
  Todos,
} from "@/app/repository/contracts/TodoRepository";
import { TodoType } from "@/app/types/cosxs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const body: { data: TodoType[] } = await request.json();

  body.data.forEach(async element => {
    await (Todos as TodoRepository).update(element.id || 0, element);
    console.log(element.id, " updated");
  });
  return NextResponse.json(body);
};
