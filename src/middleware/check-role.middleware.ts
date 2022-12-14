import { NextFunction, Response, Request } from 'express';

import { ForbiddenError, MIDDLEWARE_ERROR_MESSAGE } from '@errors';
import { USER_ROLE } from '@users';

export const checkRole =
  (permittedRole: USER_ROLE) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const role = req.role;

      if (role !== permittedRole) {
        throw new ForbiddenError(MIDDLEWARE_ERROR_MESSAGE.NOT_AVAILABLE_FOR_YOU_ROLE);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
