// app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Todos } from "@/app/repository/contracts/TodoRepository";
import { TodoType } from "@/app/types/cosxs";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const couple_id = searchParams.get("cid");
    const user_id = searchParams.get("user_id");
    const completed = searchParams.get("completed");

    var filter: any = {};
    
    if (couple_id) filter.couple_id = couple_id;
    if (user_id) filter.user_id = user_id;
    if (completed !== null) filter.completed = completed === "true";

    console.log("Search Params ", filter);

    const todos = await Todos.filter(filter);
    return NextResponse.json({ data: todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body);

    const todoData: TodoType = {
      id: body.id,
      description: body.description || null,
      completed: body.completed || false,
      color: body.color || "#fff",
      due_date: body.due_date || null,
      user_id: body.user_id || null,
      couple_id: body.couple_id || null,
      created_at: body.created_at,
      updated_at: body.updated_at,
    };

    const todo = await Todos.create(todoData);

    if (!todo) {
      return NextResponse.json(
        { error: "Failed to create todo" },
        { status: 500 }
      );
    }

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};