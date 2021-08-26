const ApiError = require("../error/ApiError");

function errorHandler(err, req, res, next) {
  let name = "GenericError";
  let statusCode = 500;
  let message = "Some error occured";
  let error = "Internal Server Error";
  let details = [];

  if (err instanceof ApiError) {
    name = err.name;
    statusCode = err.statusCode;
    message = err.message;
    error = err.error;
    details = err.details;
  }

  res.status(statusCode).json({ name, statusCode, message, error, details });
}

module.exports = errorHandler;
