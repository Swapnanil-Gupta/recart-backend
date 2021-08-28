import ApiError from "../error/ApiError";
import { Request, Response, NextFunction } from "express";
import logger from "../configs/logger";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error response => %O", err);

  let name = "GenericError";
  let statusCode = 500;
  let message = "Some error occured";
  let error = "Internal Server Error";
  let details: string[] = [];

  if (err instanceof ApiError) {
    name = err.name;
    statusCode = err.statusCode;
    message = err.message;
    error = err.error;
    details = err.details;
  }

  res.status(statusCode).json({ name, statusCode, message, error, details });
}

export default errorHandler;
