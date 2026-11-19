"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [uploadFile, setuploadFile] = useState<File | null>(null);
  const [uploadFileLoading, setuploadFileLoading] = useState(false);
  const [fileLink, setfileLink] = useState<any>(null);

  function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (file) {
      setuploadFile(file);
    }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!uploadFile) {
      alert("File is required");
      return;
    }

    let fileUrl = "";

    setuploadFileLoading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    const folderName = "cloudinary-tutorial";
    formData.append("folderName", folderName);

    const { data: resData } = await axios.post("/api/cosxs/fileupload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // handle cloudinary error
    if (resData.error) {
      alert("Error uploading file");
      setuploadFileLoading(false);
      return;
    }

    // cloudinary success
    fileUrl = resData.res.secure_url;
    setfileLink(fileUrl);
    setuploadFileLoading(false);
    setuploadFile(null);
    alert("file uploaded");
    return;
  }

  return (
    <div className="h-[100dvh] w-[100dvw] bg-gray-200 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-7 bg-white rounded-3xl shadow-2xl w-full p-7"
      >
        <h1 className="text-xl font-bold text-gray-400">Upload File</h1>

        {/* hidden input */}
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* label for input */}
        <label
          htmlFor="file-input"
          className="flex items-center gap-2 bg-gray-100 border cursor-pointer border-gray-100 px-5 py-3 text-sm rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          {uploadFile ? "Change file" : "Upload file"}
        </label>

        {/* show image preview */}
        {uploadFile && (
          <div className="flex flex-col gap-2 items-center">
            <span className="text-sm text-gray-600 max-w-[220px] truncate">
              {uploadFile.name}
            </span>

            {uploadFile?.type?.startsWith("image/") && (
              <img
                src={URL.createObjectURL(uploadFile)}
                alt="previewimage"
                className="max-w-[200px] rounded-lg"
              />
            )}
          </div>
        )}

        {/* upload button */}
        <button
          type="submit"
          disabled={uploadFileLoading}
          className="h-full py-3 px-8 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors duration-200"
        >
          {uploadFileLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload
            </span>
          )}
        </button>

        {/* file link */}
        {fileLink && (
          <Link href={fileLink || ""} className="text-blue-600 hover:underline">
            File link here
          </Link>
        )}
      </form>
    </div>
  );
}