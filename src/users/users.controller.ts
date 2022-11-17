import { NextFunction, Request, Response } from 'express';
//import { AppError } from '@errors';

export class UsersController {
  static getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = 'This route for "Получить данные о себе"';
      res.status(200).send(message);
    } catch (error) {
      next(error);
    }
  };
}
