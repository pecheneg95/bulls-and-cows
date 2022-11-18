import { NextFunction, Request, Response } from 'express';

export class LeaderboardController {
  static getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Get all me games")

      res.status(200).json("Get all me games");
    } catch (error) {
      next(error);
    }
  };
}
