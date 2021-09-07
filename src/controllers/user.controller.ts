import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError";
import RefreshToken from "../models/RefreshToken";
import roles from "../configs/roles";
import logger from "../configs/logger";
import errorMessages from "../error/errorMessages";

class UserController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    const errMsg = errorMessages.admin.createAdmin;

    const { name, email, password } = req.body;

    try {
      logger.info("finding existing user with email");
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        logger.error("user already exists");
        return next(ApiError.badRequest(errMsg, ["Email already exists"]));
      }
      logger.info("existing user not found");
    } catch (err) {
      logger.error("unable to check existing user => %O", err);
      return next(
        ApiError.internal(errMsg, [
          "Failed to check email, create user terminated",
        ])
      );
    }

    let hashedPassword = null;
    try {
      logger.info("generating salt/hash");
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    } catch (err) {
      logger.error("unable to generate salt/hash => %O", err);
      return next(
        ApiError.internal(errMsg, [
          "Failed to hash password, create user terminated",
        ])
      );
    }

    logger.info("creating new admin");
    const newUser: any = new User({
      name,
      email,
      hashedPassword,
      role: roles.admin,
    });
    try {
      await newUser.save();
      logger.info("new admin created successfully");
      res.status(201).send(newUser);
    } catch (err) {
      logger.error("unable to create new admin => %O", err);
      return next(ApiError.internal(errMsg, ["Unable to create user"]));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const errMsg = errorMessages.user.createUser;

    const { name, email, password } = req.body;

    try {
      logger.info("finding existing user with email");
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        logger.error("user already exists");
        return next(ApiError.badRequest(errMsg, ["Email already exists"]));
      }
      logger.info("existing user not found");
    } catch (err) {
      logger.error("unable to check existing user => %O", err);
      return next(
        ApiError.internal(errMsg, [
          "Failed to check email, create user terminated",
        ])
      );
    }

    let hashedPassword = null;
    try {
      logger.info("generating salt/hash");
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    } catch (err) {
      logger.error("unable to generate salt/hash => %O", err);
      return next(
        ApiError.internal(errMsg, [
          "Failed to hash password, create user terminated",
        ])
      );
    }

    logger.info("creating new user");
    const newUser: any = new User({
      name,
      email,
      hashedPassword,
      role: roles.user,
    });
    try {
      await newUser.save();
      logger.info("new user created successfully");
    } catch (err) {
      logger.error("unable to create new user => %O", err);
      return next(ApiError.internal(errMsg, ["Unable to create user"]));
    }

    const tokenPayload = {
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    try {
      logger.info("generating token");
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        tokenPayload,
        process.env.REFRESH_SECRET_KEY
      );
      logger.info("token generated succesfully");

      await new RefreshToken({ userId: newUser.id, refreshToken }).save();
      logger.info("refesh token saved successfully");

      res.send({ token, refreshToken });
    } catch (err) {
      logger.error("Unable to generate/save token => %O", err);
      return next(
        ApiError.internal(errMsg, [
          "Unable to generate token, but the user has been created. Please try to login again",
        ])
      );
    }
  }

  async authenticate(req: Request, res: Response, next: NextFunction) {
    const errMsg = errorMessages.user.authenticate;

    const { email, password } = req.body;

    let existingUser = null;
    try {
      logger.info("finding existing user with email");
      existingUser = await User.findOne({ email });
      if (!existingUser) {
        logger.error("user not found");
        return next(ApiError.badRequest(errMsg, ["Email does not exist"]));
      }
      logger.info("user found");
    } catch (err) {
      return next(
        ApiError.internal(errMsg, ["Unable to check email. Sign in terminated"])
      );
    }

    logger.info("checking password validity");
    const isPasswordValid = bcrypt.compareSync(
      password,
      existingUser.hashedPassword
    );
    if (!isPasswordValid) {
      logger.error("invalid password");
      return next(ApiError.badRequest(errMsg, ["Wrong password"]));
    }
    logger.info("password is valid");

    const tokenPayload = {
      _id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    try {
      logger.info("generating token");
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        tokenPayload,
        process.env.REFRESH_SECRET_KEY
      );
      logger.info("token generated successfully");

      await RefreshToken.updateOne(
        { userId: existingUser.id },
        { userId: existingUser.id, refreshToken },
        { upsert: true }
      );
      logger.info("refesh token saved successfully");

      res.send({ token, refreshToken });
    } catch (err) {
      logger.error("Unable to generate/save token => %O", err);
      return next(ApiError.internal(errMsg, ["Unable to generate token"]));
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const errMsg = errorMessages.user.refreshToken;

    const { refreshToken } = req.body;

    let payload: any = null;
    try {
      logger.info("verifying refresh token");
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      logger.info("refresh token verified successfully");
    } catch (err) {
      logger.error("unable to verify token => %O", err);
      return next(ApiError.badRequest(errMsg, ["Invalid refresh token"]));
    }

    let existingRefreshToken = null;
    try {
      logger.info("checking if refresh token exists");
      existingRefreshToken = await RefreshToken.findOne({
        userId: payload._id,
      });
    } catch (err) {
      logger.error("unable to check token against db => %O", err);
      return next(
        ApiError.internal(errMsg, ["Unable to verify refresh token"])
      );
    }

    if (
      existingRefreshToken &&
      existingRefreshToken.refreshToken === refreshToken
    ) {
      logger.info("refresh token exists");
      logger.info("signing new token");
      try {
        const newToken = jwt.sign(
          {
            _id: payload._id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          },
          process.env.JWT_SECRET_KEY
        );
        logger.info("new token generated successfully");

        res.send({
          token: newToken,
          refreshToken,
        });
      } catch (err) {
        logger.error("unable to generate new token => %O", err);
        return next(
          ApiError.internal(errMsg, ["Unable to generate new token"])
        );
      }
    } else {
      logger.error("refresh token does not exist");
      return next(
        ApiError.badRequest(errMsg, ["Refresh token does not exist"])
      );
    }
  }
}

export default new UserController();
