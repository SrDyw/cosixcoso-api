import { NextRequest, NextResponse } from "next/server";
import { Messages } from "@/app/repository/contracts/MessageRepository";
import { MessageType } from "@/app/types/cosxs";

// GET: Obtener todos los mensajes (con filtros opcionales)
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const couple_id = searchParams.get("cid");
    const sender = searchParams.get("sender");

    var filter: any = {};

    if (couple_id) filter.couple_id = couple_id;
    if (sender) filter.sender = sender;

    console.log("Search Params ", filter);

    // Filtro general
    const messages = await Messages.filter(filter);
    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
};

// POST: Crear nuevo mensaje
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (!body.sender || !body.message) {
      return NextResponse.json(
        { error: "Sender and message are required" },
        { status: 400 }
      );
    }

    // Validar longitud del mensaje
    if (body.message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Validar longitud del sender
    if (body.sender.length > 100) {
      return NextResponse.json(
        { error: "Sender name is too long" },
        { status: 400 }
      );
    }

    const messageData: MessageType = {
      sender: body.sender.trim(),
      message: body.message.trim(),
      couple_id: body.couple_id || null,
      created_at: body.create_at
    };

    const message = await Messages.create(messageData);

    if (!message) {
      return NextResponse.json(
        { error: "Failed to create message" },
        { status: 500 }
      );
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};