import { NextRequest, NextResponse } from "next/server";
import { QuestionRepository } from "@/app/repository/contracts/QuestionAnswerRepository";
import { QuestionAnswer } from "@/app/types/cosxs";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const cid = searchParams.get("cid");
  const question_id = searchParams.get("question_id");

  return NextResponse.json({
    data: await QuestionRepository.filter({
      cid,
      question_id
    }),
  });
};



export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    console.log(body);

    const answerData: QuestionAnswer = {
      id: body.id,
      question_id: body.question_id,
      message: body.message,
      user_id: body.user_id || null,
      couple_id: body.couple_id || null,
      created_at: body.created_at,
    };

    const result = await QuestionRepository.create(answerData);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to create answer" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};
