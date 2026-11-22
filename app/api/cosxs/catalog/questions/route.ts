import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

const CAMPOS = {
  id: true,
  categoria: true,
  texto: true,
} as const;

export const GET = async () => {
  try {
    const data = await prisma.catalogQuestion.findMany({
      where: { activa: true },
      orderBy: { id: "asc" },
      select: CAMPOS,
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error reading question catalog:", error);
    return NextResponse.json({ error: "Failed to read question catalog" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const categoria = typeof body?.categoria === "string" ? body.categoria.trim() : "";
    const texto = typeof body?.texto === "string" ? body.texto.trim() : "";
    if (!categoria || !texto) {
      return NextResponse.json({ error: "Missing categoria or texto" }, { status: 400 });
    }
    const data = await prisma.catalogQuestion.create({
      data: { categoria, texto },
      select: CAMPOS,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 400 });
  }
};
