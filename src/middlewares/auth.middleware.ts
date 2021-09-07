import { NextFunction, Request, Response } from "express";
import ApiError from "../error/ApiError";
import logger from "../configs/logger";
import jwt from "jsonwebtoken";

function auth(userType: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.info("auth header is not present");
      return next(ApiError.unauthorized("No authorization header found"));
    }

    const [type, token] = authHeader.split(" ");
    if (type && type.toLowerCase() !== "bearer") {
      logger.error("token not of type bearer");
      return next(ApiError.unauthorized("Token must be of type Bearer"));
    }

    if (!token) {
      logger.error("token not found");
      return next(ApiError.unauthorized("No token found"));
    }

    let payload: any = null;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return next(ApiError.unauthorized("Invalid token"));
    }

    if (payload && payload.role !== userType) {
      return next(ApiError.unauthorized("Insufficient privilages"));
    }

    (req as Request & { user: any }).user = payload;
    next();
  };
}

export default auth;
