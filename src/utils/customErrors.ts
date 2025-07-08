export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, name = "AppError") {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = true; // for tracking known errors
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, 401, "AuthenticationError");
  }
}

export class RegistrationError extends AppError {
  constructor(message = "Registration failed") {
    super(message, 400, "RegistrationError");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400, "ValidationError");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NotFoundError");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403, "ForbiddenError");
  }
}
