import { NextFunction, Request, Response } from 'express';

import { ForbiddenError, MIDDLEWARE_ERROR_MESSAGE } from '@errors';

import { USER_ROLE } from '@users';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const role = req.role;

    if (role !== USER_ROLE.ADMIN) {
      throw new ForbiddenError(MIDDLEWARE_ERROR_MESSAGE.ONLY_FOR_ADMIN);
    }

    next();
  } catch (error) {
    next(error);
  }
};
