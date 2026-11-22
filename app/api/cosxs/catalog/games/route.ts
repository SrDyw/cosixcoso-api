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

    if (typeof body?.group_id === "string" && typeof body?.texto === "string" && body.texto.trim()) {
      const grupo = await prisma.catalogGame.findUnique({ where: { id: body.group_id } });
      if (!grupo) return NextResponse.json({ error: "Unknown group" }, { status: 400 });
      const carta = await prisma.catalogGameCard.create({
        data: {
          group_id: grupo.id,
          texto: body.texto.trim(),
          categoria: typeof body.categoria === "string" ? body.categoria : grupo.nombre,
          emoji: typeof body.emoji === "string" && body.emoji ? body.emoji : grupo.emoji,
          color: typeof body.color === "string" && body.color ? body.color : grupo.color,
        },
        select: CARTA,
      });
      return NextResponse.json(carta, { status: 201 });
    }

    const datos = body?.grupo ?? body;
    const id = typeof datos?.id === "string" ? datos.id.trim() : "";
    const nombre = typeof datos?.nombre === "string" ? datos.nombre.trim() : "";
    if (!id || !nombre) {
      return NextResponse.json({ error: "Missing group id or nombre" }, { status: 400 });
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

    const cartas = Array.isArray(body?.cartas) ? body.cartas : [];
    if (cartas.length) {
      await prisma.catalogGameCard.createMany({
        data: cartas
          .filter((c: unknown) => !!c && typeof (c as { texto?: unknown }).texto === "string")
          .map((c: { texto: string; categoria?: string; emoji?: string; color?: string }) => ({
            group_id: grupo.id,
            texto: c.texto,
            categoria: c.categoria ?? grupo.nombre,
            emoji: c.emoji ?? grupo.emoji,
            color: c.color ?? grupo.color,
          })),
      });
    }

    return NextResponse.json(grupo, { status: 201 });
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json({ error: "Failed to create game" }, { status: 400 });
  }
};
