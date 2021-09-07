import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import reviewController from "../controllers/review.controller";
import reviewValidator from "../validators/review.validator";
import roles from "../configs/roles";
import validationMiddleware from "../middlewares/validation.middleware";
import errorMessages from "../error/errorMessages";

const router = Router();

router.get(
  "/:productId",
  reviewValidator.getReviewByProductIdValidator(),
  validationMiddleware(errorMessages.review.getReviewsByProductId),
  reviewController.getReviewsByProductId
);
router.get(
  "/:productId/aggregate",
  reviewValidator.getReviewByProductIdValidator(),
  validationMiddleware(errorMessages.review.getReviewAggregateByProductId),
  reviewController.getReviewAggregateByProductId
);
router.post(
  "/:productId",
  auth(roles.user),
  reviewValidator.getCreateReviewValidator(),
  validationMiddleware(errorMessages.review.createReviewForProductId),
  reviewController.createReviewForProductId
);

export default router;
