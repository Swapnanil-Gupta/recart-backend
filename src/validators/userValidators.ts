import { body, checkSchema, Schema } from "express-validator";

const userValidationSchema: Schema = {
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

const userAuthenticateValidationSchema: Schema = {
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
  createUserValidator() {
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

export default new UserValidator();
