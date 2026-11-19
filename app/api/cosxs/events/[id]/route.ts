import { NextRequest, NextResponse } from "next/server";
import { Events } from "@/app/repository/contracts/EventsRepository";
import type { OperationResultResponse } from "@/app/types/cosxs";

// GET: Obtener evento específico
export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
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

    const event = await Events.find(parsedId);
    
    if (event) {
      return NextResponse.json(event);
    }

    return NextResponse.json(
      { message: `Event ${parsedId} not found` },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// DELETE: Eliminar evento
export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const parsedId = Number.parseInt(id);

    if (isNaN(parsedId)) {
      const response: OperationResultResponse = {
        message: "The Id must be a valid integer number",
        error: true,
      };
      return NextResponse.json(response, { status: 400 });
    }

    const deleted = await Events.remove(parsedId);
    
    if (deleted) {
      const response: OperationResultResponse = {
        error: false,
        message: `Event ${parsedId} removed successfully`,
      };
      return NextResponse.json(response);
    }

    return NextResponse.json(
      { message: `Event ${parsedId} does not exist` },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// PUT: Actualizar evento completo
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const parsedId = Number.parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validaciones
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "Title, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    if (body.startDate > body.endDate) {
      return NextResponse.json(
        { error: "endDate must be after or equal to startDate" },
        { status: 400 }
      );
    }

    if (body.color && !/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
      return NextResponse.json(
        { error: "Color must be a valid hex color" },
        { status: 400 }
      );
    }

    const updatedEvent = await (Events as any).update(parsedId, {
      title: body.title,
      description: body.description || null,
      startDate: body.startDate,
      endDate: body.endDate,
      color: body.color || "#3b82f6",
      userId: body.userId || null
    });

    if (!updatedEvent) {
      return NextResponse.json(
        { error: `Event ${parsedId} not found or update failed` },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }
};

// PATCH: Actualizar evento parcialmente
export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const parsedId = Number.parseInt(id);

    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validaciones para campos que se actualizan
    if (body.startDate && body.endDate && body.startDate > body.endDate) {
      return NextResponse.json(
        { error: "endDate must be after or equal to startDate" },
        { status: 400 }
      );
    }

    if (body.color && !/^#[0-9A-Fa-f]{6}$/.test(body.color)) {
      return NextResponse.json(
        { error: "Color must be a valid hex color" },
        { status: 400 }
      );
    }

    const updatedEvent = await (Events as any).update(parsedId, body);

    if (!updatedEvent) {
      return NextResponse.json(
        { error: `Event ${parsedId} not found or update failed` },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error patching event:', error);
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }
};