import { NextFunction, Response, Request } from 'express';

import { GetLeaderboardSanitizedRequest, GetUserStatsSanitizedRequest } from './users.types';
import { UsersService } from './users.service';

export class UsersController {
  static async getInfoAboutMyself(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      const user = await UsersService.findById(userId);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req: GetUserStatsSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;

      const stats = await UsersService.getStats(userId);

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getLeaderboard(req: GetLeaderboardSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const sortField = req.query.sort;
      const dateFrom = req.query.from;
      const dateTo = req.query.to;
      const offset = req.query.offset;
      const limit = req.query.limit;

      const leaderboard = await UsersService.getLeaderboard(sortField, dateFrom, dateTo, offset, limit);

      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
