import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { BadRequestError, UnauthorizedError, AUTHORIZATION_ERROR_MESSAGE } from '@errors';

import { USER_ROLE } from '@users';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const secret = process.env.JWT_SECRET as string;
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new BadRequestError(AUTHORIZATION_ERROR_MESSAGE.HEADER_IS_MISSING);
    }

    const [, token] = authHeader.split(' '); // 'Bearer {{token}}'

    const verifiedToken = jwt.verify(token, secret) as jwt.JwtPayload & { userId: number; role: USER_ROLE };

    req.userId = verifiedToken.userId;
    req.role = verifiedToken.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      return next(new UnauthorizedError(AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError(AUTHORIZATION_ERROR_MESSAGE.TOKEN_IS_MISSING));
    }

    next(error);
  }
};
