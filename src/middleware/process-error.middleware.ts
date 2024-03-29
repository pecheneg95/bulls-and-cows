import { isAppError } from '@errors';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const processError = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (isAppError(error)) {
    const { message, statusCode } = error;

    res.status(statusCode).json({ message, statusCode });

    return;
  }

  console.error(error);

  if (error instanceof SyntaxError) {
    res.status(400).json({ message: 'Request parsing error', statusCode: 400 });

    return;
  }

  res.status(500).json({ message: 'Server error', statusCode: 500 });
};
