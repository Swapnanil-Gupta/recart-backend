import { NextFunction, Request, Response } from "express";
import cloudinary from "../configs/cloudinary";
import logger from "../configs/logger";
import ApiError from "../error/ApiError";
import fs from "fs";

function uploadToCloudinaryMiddleware(errMsg: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      logger.error("req.file is not present");
      return next(ApiError.badRequest(errMsg, ["Image is required"]));
    }

    try {
      logger.info("starting cloudinary image upload");
      const cloudinaryResp = await cloudinary.uploader.upload(req.file.path, {
        upload_preset: "recart",
      });
      (req as Request & { uploadedImageUrl: string }).uploadedImageUrl =
        cloudinaryResp.secure_url;
      logger.info("image uploaded successfully to cloudinary");

      logger.info("cleaning up temp upload");
      fs.unlink(req.file.path, (err) => {
        if (err) {
          logger.error("unable to cleanup temp image");
        } else {
          logger.info("cleaned up temp image");
        }
      });
      next();
    } catch (err) {
      logger.error("unable to upload image to cloudinary => %O", err);
      next(ApiError.internal(errMsg, ["Unable to upload image to cloudinary"]));
    }
  };
}

export default uploadToCloudinaryMiddleware;
