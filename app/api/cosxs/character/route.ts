// app/api/characters/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Characters } from "@/app/repository/contracts/CharacterRepository";
import { CharacterType } from "@/app/types/cosxs";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const id = searchParams.get("id");
    const cid = searchParams.get("cid");
    

    var filter: any = {};
    if (name) filter.name = name;
    if (id) filter.id = parseInt(id);
    if (cid) filter.cid = cid;

    console.log("Search Params ", filter);

    const characters = await Characters.filter(filter);
    return NextResponse.json({ data: characters });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const characterData: CharacterType = {
      id: body.id,
      name: body.name.trim(),
      touches: body.touches || 0,
      emoji: body.emoji || 1,
      gender: body.gender,
      couple_id: body.couple_id,
    };

    const character = await Characters.create(characterData);

    if (!character) {
      return NextResponse.json(
        { error: "Failed to create character" },
        { status: 500 }
      );
    }

    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("Error creating character:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};