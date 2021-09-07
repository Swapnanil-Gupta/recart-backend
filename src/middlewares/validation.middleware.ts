import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiError from "../error/ApiError";
import logger from "../configs/logger";

function validationMiddleware(errMsg: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    logger.info("checking for validation errors");
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      logger.error("validation error occured");
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }
    logger.info("no validation errors. Proceeding..");
    next();
  };
}

export default validationMiddleware;
