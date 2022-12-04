import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { BadRequestError, UnauthorizedError } from '@errors';
import { JWT_SECRET } from '@auth';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new BadRequestError('Authorization header is missing');
    }

    const [, token] = authHeader.split(' '); // 'Bearer {{token}}'

    const verifiedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { userId: number; role: string };

    req.userId = verifiedToken.userId;
    req.role = verifiedToken.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      return next(new UnauthorizedError('Invalid authorization token'));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Authorization token expired'));
    }

    next(error);
  }
};
