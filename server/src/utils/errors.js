class AppError extends Error {
  constructor(message, statusCode, code, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true; // Marks trusted errors vs bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad Request", details = null) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, 409, "CONFLICT", details);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation Failed", details = null) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
};
