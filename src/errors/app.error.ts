export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
