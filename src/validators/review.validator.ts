import { param, checkSchema, Schema } from "express-validator";

const reviewValidationSchema: Schema = {
  productId: {
    in: "params",
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Product id is required",
    },
    isMongoId: {
      errorMessage: "Product id is not valid",
    },
  },
  review: {
    in: "body",
    trim: true,
    isEmpty: {
      negated: true,
    },
    errorMessage: "Review comment is required",
  },
  rating: {
    in: "body",
    isEmpty: {
      negated: true,
      errorMessage: "Rating is required",
    },
    isInt: {
      options: {
        min: 1,
        max: 5,
      },
      errorMessage: "Rating can only be between 1 & 5",
    },
  },
};

class ReviewValidator {
  getCreateReviewValidator() {
    return checkSchema(reviewValidationSchema);
  }

  getReviewByProductIdValidator() {
    return param("productId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Product id is required")
      .isMongoId()
      .withMessage("Product id is not valid");
  }
}

export default new ReviewValidator();
