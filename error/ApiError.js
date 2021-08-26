class ApiError {
  constructor(statusCode, message, error, details) {
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.details = details;
  }

  static internal(message, details) {
    return new ApiError(500, message, "Internal Server Error", details);
  }

  static badRequest(message, details) {
    return new ApiError(400, message, "Bad Request", details);
  }

  static notFound(message) {
    return new ApiError(404, message, "Not Found", []);
  }
}

module.exports = ApiError;
