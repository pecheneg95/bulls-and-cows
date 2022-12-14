import { NextFunction, Response, Request } from 'express';
import { DEFAULT_USERS_LIMIT, DEFAULT_USERS_OFFSET, STATS } from './users.constants';

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

  static async getUserStats(
    req: Request<{ userId: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = Number(req.params.userId);
      const stats = await UsersService.getStats(userId);

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  static async getLeaderboard(
    req: Request<unknown, unknown, unknown, { sort: STATS; from: string; to: string; offset: string; limit: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sortField = req.query.sort;
      const dateFrom = new Date(req.query.from);
      const dateTo = new Date(req.query.to);
      const offset = Number(req.query.offset) || DEFAULT_USERS_OFFSET;
      const limit = Number(req.query.limit) || DEFAULT_USERS_LIMIT;

      const leaderboard = await UsersService.getLeaderboard(sortField, dateFrom, dateTo, offset, limit);

      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}
