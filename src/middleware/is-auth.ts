import { AppError } from '@errors';
import { JWT_SECRET } from '@auth';
import { NextFunction, Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';

export function isAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) throw new AppError('Authorization header is missing', 400);

    const [, token] = authHeader.split(' '); // 'Bearer {{token}}'

    const verifiedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { userId: number; role: string };

    req.userId = verifiedToken.userId;
    req.role = verifiedToken.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      next(new AppError('Authorization failed', 401));
      return;
    }
    next(error);
  }
}
