import { config } from "../config/index.js";
import { logger } from "../config/logger.js";
import { AppError, BadRequestError, ConflictError, InternalServerError } from "../utils/errors.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Normalize known errors to AppError
  if (!(error instanceof AppError)) {
    // Mongoose CastError (Invalid ID)
    if (error.name === "CastError") {
      error = new BadRequestError(`Invalid ${error.path}: ${error.value}`);
    }
    // Mongoose Duplicate Key
    else if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      error = new ConflictError(`Duplicate field value: ${field}`);
    }
    // Mongoose Validation Error
    else if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((val) => ({
        field: val.path,
        message: val.message,
      }));
      error = new BadRequestError("Validation Error", details);
    }
    // JWT Errors
    else if (error.name === "JsonWebTokenError") {
      error = new UnauthorizedError("Invalid token");
    }
    else if (error.name === "TokenExpiredError") {
      error = new UnauthorizedError("Token expired");
    }
    // Default to Internal Server Error for unknown errors
    else {
      error = new InternalServerError(error.message);
      error.stack = err.stack; // Keep original stack
    }
  }

  // Log the error
  const logData = {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
  };

  if (error.statusCode >= 500) {
    logger.error({ ...logData, stack: error.stack }, "Server Error");
  } else {
    logger.warn(logData, "Client Error");
  }

  // Send response
  res.status(error.statusCode).json({
    status: "error",
    code: error.code,
    message: error.message,
    details: error.details,
    ...(config.nodeEnv === "development" && { stack: error.stack }),
  });
};

export default errorMiddleware;
