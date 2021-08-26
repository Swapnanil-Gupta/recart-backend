import { Router } from "express";
import userController from "../controllers/userController";
import userValidator from "../validators/userValidators";

const router = Router();

router.post("/", userValidator.signupValidator(), userController.signup);
router.post(
  "/authenticate",
  userValidator.authenticateValidator(),
  userController.signin
);
router.post(
  "/refreshToken",
  userValidator.refreshTokenValidator(),
  userController.refreshToken
);

export default router;
