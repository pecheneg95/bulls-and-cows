import { NextFunction, Request, Response } from 'express';
import { USER_ROLE } from './users.constants';

export class UsersController {
  static me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;

      const userDTO = {
        id: userId,
        username: "Artyom",
        email: "artyom@email.com",
        role: USER_ROLE.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      console.log(userDTO)
      res.status(200).json(userDTO);
    } catch (error) {
      next(error);
    }
  };

  static stats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;

      const statsDTO = {
        userid: userId,
        username: "Artyom",
        gamesCount: 5,
        winsCount: 1,
        lossesCount: 3,
        drawCount: 1,
        completedGamesCount: 5,
        averageStepsCountToWin: 20,
      }
      console.log(statsDTO)
      res.status(200).json(statsDTO);
    } catch (error) {
      next(error);
    }
  };
}
