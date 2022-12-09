import { NextFunction, Request, Response } from 'express';

import { STATS } from './users.constants';
import { UsersService } from './users.service';

export class UsersController {
  static async getInfoAboutMyself(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const user = await UsersService.findById(userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.params.userId);
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

      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
