// app/api/todos/[id]/route.ts
import TodoRepository, {
  Todos,
} from "@/app/repository/contracts/TodoRepository";
import type { OperationResultResponse, TodoType } from "@/app/types/cosxs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const parsedId = Number.parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json(
      {
        error: "Invalid Id",
        message: "The Id must be a valid integer number",
      },
      { status: 400 }
    );
  }

  var todo = await Todos.find(parsedId);
  if (todo != undefined) {
    return NextResponse.json(todo);
  }

  return NextResponse.json(
    { message: `Todo with id ${parsedId} not found` },
    { status: 404 }
  );
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const parsedId = Number.parseInt(id);

  if (isNaN(parsedId)) {
    var response: OperationResultResponse = {
      message: "The Id must be a valid integer number",
      error: true,
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (await Todos.remove(parsedId)) {
    var response: OperationResultResponse = {
      error: false,
      message: `Todo with id ${parsedId} removed successfully`,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json({ message: "Todo does not exist" }, { status: 404 });
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const parsedId = Number.parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const todoData: Partial<TodoType> = {};

    if (body.description !== undefined) todoData.description = body.description;
    if (body.completed !== undefined) todoData.completed = body.completed;
    if (body.color !== undefined) todoData.color = body.color;
    if (body.due_date !== undefined) todoData.due_date = body.due_date;
    if (body.user_id !== undefined) todoData.user_id = body.user_id;
    if (body.couple_id !== undefined) todoData.couple_id = body.couple_id;

    if (Object.keys(todoData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const todo = await (Todos as TodoRepository).update(parsedId, todoData);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};
