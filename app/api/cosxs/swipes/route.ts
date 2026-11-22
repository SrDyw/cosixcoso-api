import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

const CHOICES = new Set(["si", "no", "igual"]);

export const GET = async (request: NextRequest) => {
  const cid = new URL(request.url).searchParams.get("cid");
  if (!cid) return NextResponse.json({ data: [] });

  try {
    const data = await prisma.swipeChoice.findMany({
      where: { couple_id: cid },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error reading swipes:", error);
    return NextResponse.json({ error: "Failed to read swipes" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const cardId = Number(body?.card_id);
    const userId = typeof body?.user_id === "string" ? body.user_id : "";
    const coupleId = typeof body?.couple_id === "string" ? body.couple_id : "";
    const choice = typeof body?.choice === "string" ? body.choice : "";

    if (!Number.isInteger(cardId) || !userId || !coupleId || !CHOICES.has(choice)) {
      return NextResponse.json({ error: "Invalid swipe" }, { status: 400 });
    }

    const swipe = await prisma.swipeChoice.upsert({
      where: {
        couple_id_card_id_user_id: {
          couple_id: coupleId,
          card_id: cardId,
          user_id: userId,
        },
      },
      create: { card_id: cardId, user_id: userId, couple_id: coupleId, choice },
      update: { choice },
    });
    return NextResponse.json(swipe);
  } catch (error) {
    console.error("Error saving swipe:", error);
    return NextResponse.json({ error: "Failed to save swipe" }, { status: 400 });
  }
};
