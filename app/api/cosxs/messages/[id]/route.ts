import { Messages } from "@/app/repository/contracts/MessageRepository";
import type { OperationResultResponse } from "@/app/types/cosxs";
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
      { status: 400 } // Bad Request
    );
  }
  var message = await Messages.find(parsedId);
  if (message != undefined) {
    return NextResponse.json(message);
  }

  return NextResponse.json(
    { message: `Message ${parsedId} not found` },
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
    return NextResponse.json(
      response,
      { status: 400 } // Bad Request
    );
  }
  if (await Messages.remove(parsedId)) {
    var response: OperationResultResponse = {
      error: false,
      message: `Message ${parsedId} removed successfully`,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json(
    {
      message: "Message does not exist",
    },
    { status: 404 }
  );
};