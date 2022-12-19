import { NextFunction, Response, Request } from 'express';

import { ForbiddenError, AUTHORIZATION_ERROR_MESSAGE } from '@errors';
import { USER_ROLE } from '@users';

export const checkRole =
  (permittedRole: USER_ROLE) =>
  <T extends Request<any, any, any, any>>(req: T, res: Response, next: NextFunction): void => {
    try {
      const role = req.role;

      if (role !== permittedRole) {
        throw new ForbiddenError(AUTHORIZATION_ERROR_MESSAGE.NOT_AVAILABLE_FOR_YOU_ROLE);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
