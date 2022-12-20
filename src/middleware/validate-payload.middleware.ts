import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validatePayload = <T extends Request<any, any, any, any>>(
  req: T,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Bad request', statusCode: 400, errors: errors.array() });

    return;
  }

  next();
};
