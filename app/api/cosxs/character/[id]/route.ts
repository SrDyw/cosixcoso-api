// app/api/characters/[id]/route.ts
import CharacterRepository, { Characters } from "@/app/repository/contracts/CharacterRepository";
import type { OperationResultResponse, CharacterType } from "@/app/types/cosxs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
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

  var character = await Characters.find(parsedId);
  if (character != undefined) {
    return NextResponse.json(character);
  }

  return NextResponse.json(
    { message: `Character with id ${parsedId} not found` },
    { status: 404 }
  );
};

export const DELETE = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const parsedId = Number.parseInt(id);

  if (isNaN(parsedId)) {
    var response: OperationResultResponse = {
      message: "The Id must be a valid integer number",
      error: true,
    };
    return NextResponse.json(response, { status: 400 });
  }

  if (await Characters.remove(parsedId)) {
    var response: OperationResultResponse = {
      error: false,
      message: `Character with id ${parsedId} removed successfully`,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json(
    { message: "Character does not exist" },
    { status: 404 }
  );
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const parsedId = Number.parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json(
      { error: "Invalid Id" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const characterData: Partial<CharacterType> = {};

    if (body.name !== undefined) characterData.name = body.name;
    if (body.touches !== undefined) characterData.touches = body.touches;
    if (body.emoji !== undefined) characterData.emoji = body.emoji;

    if (Object.keys(characterData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const character = await (Characters as CharacterRepository).update(parsedId, characterData);

    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("Error updating character:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};