import { AppError } from '@errors';
import { STATS, User } from '@users';
import { NextFunction, Request, Response } from 'express';
import { GamesService } from 'games/games.service';
import { Stats } from 'types/user.types';
import usersRepository from './users.repository';
import { UsersService } from './users.service';

export class UsersController {
  static me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);

      console.log('userId: ', userId);

      const user = await UsersService.findById(userId);

      if (user) {
        res.status(200).json(user);
      }
    } catch (error) {
      next(error);
    }
  };

  static stats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.userId);

      console.log('userId: ', userId);

      const user = await UsersService.findById(userId);

      if (!user) {
        AppError.notFound(`User witn id ${userId} is not found`);
      }

      if (user) {
        const stats = await GamesService.calculateUserStatistics(user);

        res.status(200).json(stats);
      }
    } catch (error) {
      next(error);
    }
  };

  static getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reqQueryLeaderboard = {
        sort: req.query.sort as STATS,
        from: new Date(Date.parse(String(req.query.from))),
        to: new Date(Date.parse(String(req.query.to))),
        offset: Number(req.query.offset),
        limit: Number(req.query.limit),
      };

      console.log(reqQueryLeaderboard);

      const allUsers = await UsersService.allUsers();

      if (!allUsers) {
        AppError.notFound('Impossible, but there are no users in the game');
      }

      if (allUsers) {
        const allUserStats: Stats[] = await (
          await Promise.all(
            allUsers.map(async (el) => {
              return GamesService.calculateUserStatistics(el, reqQueryLeaderboard.from, reqQueryLeaderboard.to);
            })
          )
        )
          .sort((a, b) => b[reqQueryLeaderboard.sort] - a[reqQueryLeaderboard.sort])
          .slice(reqQueryLeaderboard.offset, reqQueryLeaderboard.limit);

        console.log('allUserStats: ', allUserStats);
        res.status(200).json(allUserStats);
      }
    } catch (error) {
      next(error);
    }
  };

  static findUser = async (userId: number): Promise<User> => {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  };
}
