import { NextFunction, Request, Response } from "express";
import fs from "fs";
import logger from "../configs/logger";

function cleanTempUpload(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.file && req.file.path) {
    logger.info("cleaning up temp upload");
    fs.unlink(req.file.path, (err) => {
      if (err) {
        logger.error("unable to cleanup temp image");
      } else {
        logger.info("cleaned up temp image");
      }
    });
  }
  next(err);
}

export default cleanTempUpload;
