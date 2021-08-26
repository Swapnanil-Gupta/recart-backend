const { param, checkSchema } = require("express-validator");

const productValidationSchema = {
  name: {
    in: "body",
    errorMessage: "Product name is required",
    trim: true,
    isEmpty: {
      negated: true,
    },
  },
  description: {
    in: "body",
    errorMessage: "Product description is required",
    trim: true,
    isEmpty: {
      negated: true,
    },
  },
  price: {
    in: "body",
    isEmpty: {
      negated: true,
      errorMessage: "Product price is required",
    },
    isNumeric: {
      errorMessage: "Product price can only be numeric",
    },
  },
  countInStock: {
    in: "body",
    isEmpty: {
      negated: true,
      errorMessage: "Product count is required",
    },
    isNumeric: {
      errorMessage: "Product count can only be numeric",
    },
  },
};

class ProductValidator {
  getProductByIdValidator() {
    return param("id")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Product id is required")
      .isMongoId()
      .withMessage("Product id is not valid");
  }

  createProductValidator() {
    return checkSchema(productValidationSchema);
  }
}

module.exports = new ProductValidator();
