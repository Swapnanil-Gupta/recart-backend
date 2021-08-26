import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../error/ApiError";
import RefreshToken from "../models/RefreshToken";
import roles from "../configs/roles";
import { validationResult } from "express-validator";

class UserController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to create new user";

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({
        email,
      });
      if (existingUser) {
        return next(ApiError.badRequest(errMsg, ["Email already exists"]));
      }
    } catch (err) {
      return next(
        ApiError.internal(errMsg, [
          "Failed to check email, create user terminated",
        ])
      );
    }

    let hashedPassword = null;
    try {
      const salt = bcrypt.genSaltSync(10);
      hashedPassword = bcrypt.hashSync(password, salt);
    } catch (err) {
      return next(
        ApiError.internal(errMsg, [
          "Failed to hash password, create user terminated",
        ])
      );
    }

    const newUser: any = new User({
      name,
      email,
      hashedPassword,
      role: roles.user,
    });
    try {
      await newUser.save();
    } catch (err) {
      return next(ApiError.internal(errMsg, ["Unable to create user"]));
    }

    const tokenPayload = {
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    try {
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        tokenPayload,
        process.env.REFRESH_SECRET_KEY
      );

      await new RefreshToken({ userId: newUser.id, refreshToken }).save();

      res.send({ token, refreshToken });
    } catch (err) {
      console.error(err);
      return next(
        ApiError.internal(errMsg, [
          "Unable to generate token, but the user has been created. Please try to login again",
        ])
      );
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to sign in user";

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }

    const { email, password } = req.body;

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email });
      if (!existingUser) {
        return next(ApiError.badRequest(errMsg, ["Email does not exist"]));
      }
    } catch (err) {
      return next(
        ApiError.internal(errMsg, ["Unable to check email. Sign in terminated"])
      );
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      existingUser.hashedPassword
    );
    if (!isPasswordValid) {
      return next(ApiError.badRequest(errMsg, ["Wrong password"]));
    }

    const tokenPayload = {
      _id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    try {
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        tokenPayload,
        process.env.REFRESH_SECRET_KEY
      );

      await RefreshToken.updateOne(
        { userId: existingUser.id },
        { userId: existingUser.id, refreshToken },
        { upsert: true }
      );

      res.send({ token, refreshToken });
    } catch (err) {
      return next(ApiError.internal(errMsg, ["Unable to generate token"]));
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    const errMsg = "Unable to refresh token";

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return next(
        ApiError.badRequest(
          errMsg,
          validationErrors.array({ onlyFirstError: true })
        )
      );
    }

    const { refreshToken } = req.body;

    let payload: any = null;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    } catch (err) {
      return next(ApiError.badRequest(errMsg, ["Invalid refresh token"]));
    }

    let existingRefreshToken = null;
    try {
      existingRefreshToken = await RefreshToken.findOne({
        userId: payload._id,
      });
    } catch (err) {
      return next(
        ApiError.internal(errMsg, ["Unable to verify refresh token"])
      );
    }

    if (
      existingRefreshToken &&
      existingRefreshToken.refreshToken === refreshToken
    ) {
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

        res.send({
          token: newToken,
          refreshToken,
        });
      } catch (err) {
        return next(
          ApiError.internal(errMsg, ["Unable to generate new token"])
        );
      }
    } else {
      return next(
        ApiError.badRequest(errMsg, ["Refresh token does not exist"])
      );
    }
  }
}

export default new UserController();
