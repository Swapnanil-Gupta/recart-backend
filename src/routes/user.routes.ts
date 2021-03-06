import { Router } from "express";
import userController from "../controllers/user.controller";
import userValidator from "../validators/user.validator";
import validationMiddleware from "../middlewares/validation.middleware";
import errorMessages from "../error/errorMessages";
import auth from "../middlewares/auth.middleware";
import roles from "../configs/roles";

const router = Router();

// TODO: Add validator for query params
router.get("/", userController.getUsers);
router.post(
  "/",
  userValidator.createUserValidator(),
  validationMiddleware(errorMessages.user.createUser),
  userController.createUser
);
router.post(
  "/admin",
  auth([roles.admin]),
  userValidator.createUserValidator(),
  validationMiddleware(errorMessages.admin.createAdmin),
  userController.createAdmin
);
router.post(
  "/authenticate",
  userValidator.authenticateValidator(),
  validationMiddleware(errorMessages.user.authenticate),
  userController.authenticate
);
router.get(
  "/validateToken",
  auth([roles.user, roles.admin]),
  userController.validateToken
);
router.post(
  "/refreshToken",
  userValidator.refreshTokenValidator(),
  validationMiddleware(errorMessages.user.refreshToken),
  userController.refreshToken
);

export default router;
