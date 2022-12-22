import { NextFunction, Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

import { BadRequestError, UnauthorizedError, AUTHORIZATION_ERROR_MESSAGE } from '@errors';

import { USER_ROLE } from '@users';
import { config } from '@config';

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new BadRequestError(AUTHORIZATION_ERROR_MESSAGE.HEADER_IS_MISSING);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new BadRequestError(AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN);
    }

    const [, token] = authHeader.split(' '); // 'Bearer {{token}}'

    if (!token) {
      throw new BadRequestError(AUTHORIZATION_ERROR_MESSAGE.TOKEN_IS_MISSING);
    }

    const secret = config.DEV.JWT_SECRET;
    const verifiedToken = jwt.verify(token, secret) as jwt.JwtPayload & { userId: number; role: USER_ROLE };

    req.userId = verifiedToken.userId;
    req.role = verifiedToken.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError && error.message === 'jwt malformed') {
      return next(new UnauthorizedError(AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN));
    }

    if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
      return next(new UnauthorizedError(AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError(AUTHORIZATION_ERROR_MESSAGE.INVALID_TOKEN));
    }

    next(error);
  }
};
