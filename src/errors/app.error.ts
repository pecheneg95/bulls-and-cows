export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
  }

  static badRequest(message: string): AppError {
    throw new AppError(message, 400);
  }

  static forbidden(message: string): AppError {
    throw new AppError(message, 403);
  }

  static notFound(message: string): AppError {
    throw new AppError(message, 404);
  }
}
