import { QuestionRepository } from "@/app/repository/contracts/QuestionAnswerRepository";
import { OperationResultResponse } from "@/app/types/cosxs";
import { NextRequest, NextResponse } from "next/server";

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

  if (await QuestionRepository.remove(parsedId)) {
    var response: OperationResultResponse = {
      error: false,
      message: `Answer with id ${parsedId} removed successfully`,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json({ message: "Answer does not exist" }, { status: 404 });
};
