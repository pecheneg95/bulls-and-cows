import { NextFunction, Request, Response } from 'express';

import { NotFoundError, USERS_ERROR_MESSAGE } from '@errors';

import { STATS } from './users.constants';
import { UsersService } from './users.service';

export class UsersController {
  static async getInfoAboutMyself(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const user = await UsersService.findById(userId);

      if (!user) {
        throw new NotFoundError(USERS_ERROR_MESSAGE.NOT_FOUND);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const user = await UsersService.findById(userId);

      if (!user) {
        throw new NotFoundError(USERS_ERROR_MESSAGE.NOT_FOUND);
      }

      const stats = await UsersService.getStats(userId);

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sortField = req.query.sort as STATS;
      const dateFrom = new Date(String(req.query.from));
      const dateTo = new Date(String(req.query.to));
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);

      const leaderboard = await UsersService.getLeaderboard(sortField, dateFrom, dateTo, offset, limit);
      console.log(leaderboard);
      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
