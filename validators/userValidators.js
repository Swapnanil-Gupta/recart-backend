const { checkSchema, body } = require("express-validator");

const userValidationSchema = {
  email: {
    in: "body",
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    in: "body",
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Password is required",
    },
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: "Password must be at least 6 characters long",
    },
  },
  name: {
    in: "body",
    trim: true,
    isEmpty: {
      negated: true,
    },
    errorMessage: "Name is required",
  },
};

const userAuthenticateValidationSchema = {
  email: {
    in: "body",
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email format",
    },
    normalizeEmail: true,
  },
  password: {
    in: "body",
    trim: true,
    isEmpty: {
      negated: true,
      errorMessage: "Password is required",
    },
    isLength: {
      options: {
        min: 6,
      },
      errorMessage: "Password must be at least 6 characters long",
    },
  },
};

class UserValidator {
  signupValidator() {
    return checkSchema(userValidationSchema);
  }

  authenticateValidator() {
    return checkSchema(userAuthenticateValidationSchema);
  }

  refreshTokenValidator() {
    return body("refreshToken")
      .trim()
      .not()
      .isEmpty()
      .withMessage("refreshToken is required");
  }
}

module.exports = new UserValidator();
