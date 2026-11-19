import { NextRequest, NextResponse } from "next/server";
import { CloudinaryUploadResponse, ImageType } from "@/app/types/cosxs";
import MediaRepository, {
  Media,
} from "@/app/repository/contracts/MediaRepository";
import { GetDate, GetDateString } from "@/app/_libs/utils";
import { ImageRepository } from "@/app/repository/contracts/ImageRepository";
import { desc, form } from "framer-motion/client";
import { cloudinary } from "@/app/_libs/claudinary";

// cloudinary config

// var claim = {
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY,
// };

// cloudinary.config(claim);

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const cid = searchParams.get("cid");
  let from = searchParams.get("from");
  let to = searchParams.get("to");

  return NextResponse.json({
    data: await Media.filter({
      cid,
      from: from != undefined ? GetDate(from, "-") : undefined,
      to: to != undefined ? GetDate(to, "-") : undefined,
    }),
  });
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folderName = formData.get("folderName") as string;
  const key = formData.get("key") as string;
  const base64Data = formData.get("base64Data") as string;
  const couple_id = formData.get("couple_id") as string;
  const dateString = formData.get("date") as string;
  const description = formData.get("description") as string;
  const ubication = formData.get("ubication") as string;

  const date: Date = GetDate(dateString);

  console.log({
    file: file,
    folderName: folderName,
    key,
    base64Data: base64Data ? base64Data.substring(0, 10).concat("...") : "",
    couple_id,
    date,
    description,
    ubication,
  });

  // return NextResponse.json("ok");
  if (!file) {
    return NextResponse.json(
      {
        msg: "File not found",
      },
      { status: 404 }
    );
  }
  const bytes = await file.arrayBuffer();
  if ((Media as MediaRepository).isInDevelopmentMode()) {
    var image: ImageType = {
      created_at: GetDateString(new Date()),
      data: base64Data,
      key,
      couple_id,
    };
    console.log("DATA", image);
    var result = await ImageRepository.create(image);
    if (result != undefined) {
      var databaseAddResponse = await Media.create({
        key: key,
        url: "",
        url2: "",
        couple_id,
        created_at: GetDateString(new Date()),
        date,
        description,
        date_string: GetDateString(date),
        ubication,
      });
      if (databaseAddResponse != undefined) {
        return NextResponse.json(databaseAddResponse, { status: 200 });
      }
      return NextResponse.json(
        {
          msg: "Error saving image at media databse",
          statusCode: 500,
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        msg: "Error saving image at databse",
        statusCode: 500,
      },
      {
        status: 500,
      }
    );
  }
  try {
    // main cloudinary upload code
    const buffer = Buffer.from(bytes);
    const res = await new Promise<CloudinaryUploadResponse>((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (error) rej(error);
          else res(result as any);
        }
      );
      uploadStream.end(buffer);
    });
    console.log("File upload successfuly!", res);

    var databaseAddResponse = await Media.create({
      key: key,
      url: res.secure_url,
      url2: res.url,
      couple_id,
      date,
      description,
      date_string: GetDateString(date),
      ubication,
    });
    if (databaseAddResponse == null) {
      throw new Error("Error adding to database");
    }
    return NextResponse.json(databaseAddResponse);
  } catch (error) {
    return NextResponse.json({
      msg: error,
      statusCode: 500,
    });
  }
}
