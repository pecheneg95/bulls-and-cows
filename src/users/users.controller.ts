import { NextFunction, Request, Response } from 'express';
//import { USER_ROLE } from './users.constants';

export class UsersController {
  static me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Info about me');

      res.status(200).json('Info about me');
    } catch (error) {
      next(error);
    }
  };

  static stats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;

      console.log('userId: ', userId);

      res.status(200).json(userId);
    } catch (error) {
      next(error);
    }
  };
}
