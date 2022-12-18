import { Response, NextFunction } from 'express';

import {
  DEFAULT_USERS_DATE_FROM,
  DEFAULT_USERS_DATE_TO,
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_OFFSET,
  STATS,
} from './users.constants';
import { GetLeaderboardRequest, GetUserStatsRequest } from './users.types';

export class UsersSanitizer {
  static getUserStats(req: GetUserStatsRequest, res: Response, next: NextFunction): void {
    try {
      req.params.userId = Number(req.params.userId);

      next();
    } catch (error) {
      next(error);
    }
  }

  static getLeaderboard(req: GetLeaderboardRequest, res: Response, next: NextFunction): void {
    try {
      req.query.sort = req.query.sort as STATS;

      if (req.query.from) {
        req.query.from = new Date(req.query.from);
      } else {
        req.query.from = DEFAULT_USERS_DATE_FROM;
      }

      if (req.query.to) {
        req.query.to = new Date(req.query.to);
      } else {
        req.query.to = DEFAULT_USERS_DATE_TO;
      }

      if (req.query.offset) {
        req.query.offset = Number(req.query.offset);
      } else {
        req.query.offset = DEFAULT_USERS_OFFSET;
      }

      if (req.query.limit) {
        req.query.limit = Number(req.query.limit);
      } else {
        req.query.limit = DEFAULT_USERS_LIMIT;
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
