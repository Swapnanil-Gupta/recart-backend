import { NextFunction, Request, Response } from "express";
import logger from "../configs/logger";

export default function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info(
    `Incoming request => from: ${req.ip}, method: ${req.method}, path: ${req.path}, params: %O, query: %O`,
    req.params,
    req.query
  );
  logger.verbose("Incoming request %O", req);
  logger.verbose("Request body => %O", req.body);
  res.on("finish", () => {
    logger.verbose("Completed response %O", res);
    logger.info(`Request completed => statusCode: ${res.statusCode}`);
  });
  next();
}
