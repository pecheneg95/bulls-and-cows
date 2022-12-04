import { NextFunction, Request, Response } from 'express';
import { STATS } from './users.constants';

export class UsersController {
  static getInfoAboutMyself = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Info about me');

      res.status(200).json('User');
    } catch (error) {
      next(error);
    }
  };

  static getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;

      console.log('userId: ', userId);

      res.status(200).json('Stats');
    } catch (error) {
      next(error);
    }
  };

  static getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqQueryLeaderboard = {
        sort: req.query.sort as STATS,
        from: new Date(String(req.query.from)),
        to: new Date(String(req.query.to)),
        offset: Number(req.query.offset),
        limit: Number(req.query.limit),
      };

      console.log(reqQueryLeaderboard);

      res.status(200).json('Leaderboard');
    } catch (error) {
      next(error);
    }
  };
}
