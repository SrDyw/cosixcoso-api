import { cloudinary } from "@/app/_libs/claudinary";
import { GetDate, GetDateString } from "@/app/_libs/utils";
import DevImageRepository, {
  ImageRepository,
} from "@/app/repository/contracts/ImageRepository";
import MediaRepository, {
  Media,
} from "@/app/repository/contracts/MediaRepository";
import {
  CloudinaryUploadResponse,
  ImageType,
  OperationResultResponse,
} from "@/app/types/cosxs";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  console.log(id);
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return NextResponse.json(
      {
        error: "Invalid Id",
        message: "The Id must be a valid integer number",
      },
      { status: 400 } // Bad Request
    );
  }
  var media = await Media.find(parsedId);
  if (media != undefined) {
    return NextResponse.json(media);
  }

  return NextResponse.json(
    { message: `Media ${parsedId} not found` },
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

  if (process.env.NODE_ENV == "development") {
    var key = (await Media.find(parsedId))?.key;
    if (key != undefined) {
      var result = await (ImageRepository as DevImageRepository).removeByKey(
        key
      );
      if (result) {
        console.log(
          `Media ${parsedId} Removed from dev database image key (${key})`
        );
      }
    } else {
      return NextResponse.json(
        {
          error: true,
          message: `Failed to remove from dev database media ${parsedId}`,
        },
        {
          status: 500,
        }
      );
    }
  }

  if (await Media.remove(parsedId)) {
    var response: OperationResultResponse = {
      error: false,
      message: `Media ${parsedId} removed successfully`,
    };
    return NextResponse.json(response);
  }

  return NextResponse.json(
    {
      message: "Media does not exists",
    },
    { status: 404 }
  );
};

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  console.log("ID", id);

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      {
        error: "Invalid Id",
        message: "The Id must be a valid integer number",
      },
      { status: 400 } // Bad Request
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folderName = formData.get("folderName") as string;
  const key = formData.get("key") as string;
  const base64Data = formData.get("base64Data") as string;
  const couple_id = formData.get("couple_id") as string;
  const date_string = formData.get("date") as string;
  const description = formData.get("description") as string;
  const ubication = formData.get("ubication") as string;

  const date: Date = GetDate(date_string);

  if ((Media as MediaRepository).isInDevelopmentMode()) {
    if (file != null) {
      var image: ImageType = {
        created_at: GetDateString(new Date()),
        data: base64Data,
        key,
        couple_id,
      };
      console.log("DATA", image.key);
      var currentImage = (await ImageRepository.all()).find(
        (x) => x.key == key
      );

      console.log("CURRENT IMAGE", currentImage?.key);

      var removeResult = await ImageRepository.remove(currentImage?.id ?? -1);

      console.log("REMOVE RESULT", removeResult);

      var imageResult = await ImageRepository.create(image);

      console.log("IMAGE: ", imageResult?.key);
      if (imageResult == undefined) {
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

  let claudirnaryRes: CloudinaryUploadResponse | null = null;
  console.log("FILE", file);
  if (file) {
    const currentMedia = await Media.find(parsedId);

    console.log("CURRENT", currentMedia);

    const bytes = await file.arrayBuffer();

    try {
      if (currentMedia?.public_id)
      {
        const result = await cloudinary.uploader.destroy(currentMedia.public_id);
        console.log("CLAUDINARY DELETION RESULT", result);
      }
      else 
      {
        console.warn("Current media doesnt have a public cloudinary id attached, the prev image can't be removed");
      }
      // main cloudinary upload code
      const buffer = Buffer.from(bytes);
      claudirnaryRes = await new Promise<CloudinaryUploadResponse>(
        (res, rej) => {
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
        }
      );
      console.log("File upload successfuly!", claudirnaryRes);
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          error: "Error with image upload service",
          message: error,
        },
        { status: 500 }
      );
    }
  }

  var databaseAddResponse = await (Media as MediaRepository).update(parsedId, {
    description,
    date_string: GetDateString(date),
    ubication,
    url: claudirnaryRes?.url,
    secureUrl: claudirnaryRes?.secure_url,
    public_id: claudirnaryRes?.public_id
  });
  if (databaseAddResponse != undefined) {
    return NextResponse.json(databaseAddResponse, { status: 200 });
  }
};
