import { NextRequest, NextResponse } from "next/server";
import { Journals } from "../../../repository/contracts/JournalRepository";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const cid = searchParams.get("cid");
  console.log(cid);

  return NextResponse.json({
    data: await Journals.filter({
      cid 
    }),
  });
};

export const POST = async (request: Request) => {
  const body = await request.json();
  try {
    const article = await Journals.create({
      ...body,
    }); // Here would be necessary a model validation
    return NextResponse.json(article);
  } catch {
    return NextResponse.json(
      {
        error: "Invalid input",
      },
      { status: 400 }
    );
  }
  return NextResponse.json({});
};
