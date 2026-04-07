import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudnitary";

export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folderName: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName, format: "webp" },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            console.log(error);
            reject(error);
          }
        },
      );
      uploadStream.end(fileBuffer);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
