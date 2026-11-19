// app/api/todos/[id]/toggle/route.ts
import TodoRepository, {
  Todos,
} from "@/app/repository/contracts/TodoRepository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  const completed = searchParams.get("completed");

  const parsedId = Number.parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
  }

  try {
    let completedBool: boolean = false;

    if (completed !== null) {
      // Convierte "true", "1" a true, cualquier otra cosa a false
      completedBool = completed.toLowerCase() === "true" || completed === "1";
    }
    const todo = await (Todos as TodoRepository).setCompleteState(
      parsedId,
      completedBool
    );

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: [todo],
    });
  } catch (error) {
    console.error("Error toggling todo:", error);
    return NextResponse.json(
      { error: "Failed to toggle todo" },
      { status: 500 }
    );
  }
};
