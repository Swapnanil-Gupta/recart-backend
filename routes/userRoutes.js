const express = require("express");
const userController = require("../controllers/userController");
const userValidator = require("../validators/userValidators");

const router = express.Router();

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

module.exports = router;
