import { NextFunction, Request, Response } from 'express';

export class LeaderboardController {
  static getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqQueryLeaderboard = {
        sort: req.query.sort,
        from: req.query.from,
        to: req.query.to,
        offset: req.query.offset,
        limit: req.query.limit,
      };

      console.log(reqQueryLeaderboard);

      res.status(200).json('Get leaderboard');
    } catch (error) {
      next(error);
    }
  };
}
