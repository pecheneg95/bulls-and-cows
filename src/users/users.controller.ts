import { AppError } from '@errors';
import { User } from '@users';
import { NextFunction, Request, Response } from 'express';
import usersRepository from './users.repository';
//import { USER_ROLE } from './users.constants';

export class UsersController {
  static me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Info about me');

      res.status(200).json({
        message: 'Info about me',
        role: req.role,
      });
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

  static findUser = async (userId: number): Promise<User> => {
    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  };
}
