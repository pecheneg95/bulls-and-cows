import { AppError } from '@errors';
import { NextFunction, Request, Response } from 'express';
import { USER_ROLE } from '@users';

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  try {
    const role = String(req.role);

    if (role !== USER_ROLE.ADMIN) {
      throw new AppError('Only for admin', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
}
