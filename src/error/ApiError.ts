class ApiError {
  name = "ApiError";

  constructor(
    public statusCode: number,
    public message: string,
    public error: string,
    public details: any[]
  ) {}

  static internal(message: string, details: any[]) {
    return new ApiError(500, message, "Internal Server Error", details);
  }

  static badRequest(message: string, details: any[]) {
    return new ApiError(400, message, "Bad Request", details);
  }

  static notFound(message: string) {
    return new ApiError(404, message, "Not Found", []);
  }
}

export default ApiError;
