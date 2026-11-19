import { NextRequest, NextResponse } from "next/server";
import { Media } from "@/app/repository/contracts/MediaRepository";
import { ImageRepository } from "@/app/repository/contracts/ImageRepository";
import { wait } from "@/app/_libs/promiseUtils";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const cid = searchParams.get("cid");
  const key = searchParams.get("key");

  await wait(2000);

  const reponse = await ImageRepository.filter({
    cid,
    key,
  });

  if (reponse != null) {
    const [imageData] = reponse;
    return NextResponse.json(imageData.data);
  }
};
