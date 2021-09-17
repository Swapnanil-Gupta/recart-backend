import { NextFunction, Request, Response } from "express";
import cloudinary from "../configs/cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import logger from "../configs/logger";
import ApiError from "../error/ApiError";

/*
  Use the req.file stream generated by multer to upload to cloudinary
*/
function streamUpload(req: Request): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        upload_preset: "recart",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
}

function uploadToCloudinaryMiddleware(errMsg: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      logger.error("req.file is not present");
      return next(ApiError.badRequest(errMsg, ["Image is required"]));
    }

    try {
      logger.info("starting cloudinary image upload");
      const cloudinaryResp = await streamUpload(req);
      (req as Request & { uploadedImageUrl: string }).uploadedImageUrl =
        cloudinaryResp.secure_url;
      logger.info("image uploaded successfully to cloudinary");
      next();
    } catch (err) {
      logger.error("unable to upload image to cloudinary => %O", err);
      next(ApiError.internal(errMsg, ["Unable to upload image to cloudinary"]));
    }
  };
}

export default uploadToCloudinaryMiddleware;
