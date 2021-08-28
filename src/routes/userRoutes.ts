import { Router } from "express";
import userController from "../controllers/userController";
import userValidator from "../validators/userValidators";

const router = Router();

router.post(
  "/",
  userValidator.createUserValidator(),
  userController.createUser
);
router.post(
  "/authenticate",
  userValidator.authenticateValidator(),
  userController.authenticate
);
router.post(
  "/refreshToken",
  userValidator.refreshTokenValidator(),
  userController.refreshToken
);

export default router;
