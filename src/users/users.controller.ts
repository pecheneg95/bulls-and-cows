import { NextFunction, Request, Response } from 'express';
import { USER_ROLE } from './users.constants';

export class UsersController {
  static meGet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const UserDTO = {
        id: 1,
        username: "Artyom",
        email: "artyom@email.com",
        role: USER_ROLE.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      res.status(200).json(UserDTO);
    } catch (error) {
      next(error);
    }
  };

  static statsGet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;

      console.log("UserId: ", userId);

      const StatsDTO = {
        userid: userId,
        username: "Artyom",
        gamesCount: 5,
        winsCount: 1,
        lossesCount: 3,
        drawCount: 1,
        completedGamesCount: 5,
        averageStepsCountToWin: 20,
      }

      res.status(200).json(StatsDTO);
    } catch (error) {
      next(error);
    }
  };
}
