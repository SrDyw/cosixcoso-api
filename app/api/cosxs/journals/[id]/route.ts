import { Journals } from "@/app/repository/contracts/JournalRepository";
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
  var journal = await Journals.find(parsedId);
  if (journal != undefined) {
    return NextResponse.json(journal);
  }

  return NextResponse.json(
    { message: `Journal ${parsedId} not found` },
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
  if (await Journals.remove(parsedId)) {
    var response: OperationResultResponse = {
      error: false,
      message: `Journal ${parsedId} removed successfully`,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json(
    {
      message: "journal does not exists",
    },
    { status: 404 }
  );
};
