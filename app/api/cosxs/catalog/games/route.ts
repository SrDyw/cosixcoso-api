import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

const CARTA = {
  id: true,
  texto: true,
  categoria: true,
  emoji: true,
  color: true,
} as const;

export const GET = async () => {
  try {
    const [grupos, cartas] = await Promise.all([
      prisma.catalogGame.findMany({
        where: { activa: true },
        orderBy: [{ orden: "asc" }, { created_at: "asc" }],
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          emoji: true,
          color: true,
        },
      }),
      prisma.catalogGameCard.findMany({
        where: { activa: true },
        orderBy: { id: "asc" },
        select: { ...CARTA, group_id: true },
      }),
    ]);

    const data = grupos.map((grupo) => ({
      ...grupo,
      cartas: cartas.filter((c) => c.group_id === grupo.id).map(({ group_id, ...c }) => c),
    }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error reading games catalog:", error);
    return NextResponse.json({ error: "Failed to read games catalog" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const datos = body?.grupo ?? body;
    const id = typeof datos?.id === "string" ? datos.id.trim() : "";
    const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
    const cartas = Array.isArray(body?.cartas)
      ? body.cartas.filter((c: unknown) => !!c && typeof (c as { texto?: unknown }).texto === "string")
      : [];
    if (!id || !nombre || !cartas.length) {
      return NextResponse.json({ error: "Missing group id, nombre or cartas" }, { status: 400 });
    }

    const grupo = await prisma.catalogGame.create({
      data: {
        id,
        nombre,
        descripcion: typeof datos.descripcion === "string" ? datos.descripcion : "",
        emoji: typeof datos.emoji === "string" && datos.emoji ? datos.emoji : "🎲",
        color: typeof datos.color === "string" && datos.color ? datos.color : "#7fb1c7",
        orden: Number.isInteger(datos.orden) ? datos.orden : 100,
      },
    });

    await prisma.catalogGameCard.createMany({
      data: cartas.map((c: { texto: string; categoria?: string; emoji?: string; color?: string }) => ({
        group_id: grupo.id,
        texto: c.texto,
        categoria: c.categoria ?? grupo.nombre,
        emoji: c.emoji ?? grupo.emoji,
        color: c.color ?? grupo.color,
      })),
    });

    return NextResponse.json(grupo, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json({ error: "Failed to create game" }, { status: 400 });
  }
};
