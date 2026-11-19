import { NextRequest, NextResponse } from "next/server";
import { Events } from "@/app/repository/contracts/EventsRepository";
import { EventType } from "@/app/types/cosxs";
import { wait } from "@/app/_libs/promiseUtils";

// GET: Obtener todos los eventos (con filtros opcionales)
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const couple_id = searchParams.get("cid");

    var filter = {
      cid: couple_id,
    };

    console.log("Search Params ", filter);

    return NextResponse.json({
      data: await Events.filter(filter),
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
};

// POST: Crear nuevo evento
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (!body.title || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { error: "Title, start_date, and end_date are required" },
        { status: 400 }
      );
    }

    // Validar formato de color
    if (body.color && !/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
      return NextResponse.json(
        { error: "Color must be a valid hex color (e.g., #3b82f6)" },
        { status: 400 }
      );
    }

    const eventData: EventType = {
      title: body.title,
      description: body.description || null,
      start_date: body.start_date,
      end_date: body.end_date,
      color: body.color || "#3b82f6",
      user_id: body.user_id || null,
      id: body.id,
      created_at: new Date(),
      couple_id: body.couple_id,
    };

    const event = await Events.create(eventData);

    if (!event) {
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};
