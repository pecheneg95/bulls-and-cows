import { AppError } from '@errors';
import { NextFunction, Request, Response } from 'express';
import { creatorGame, opponentGame } from 'types/game.types';
import { UsersService } from 'users/users.service';
//import { creatorGame, opponentGame } from '../types/game.types';
import { GamesService } from './games.service';

export class GamesController {
  static getAllMyGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userIds = req.query.userIds;
      console.log('Get all my games');
      if (userIds) {
        res.status(200).json(userIds);
      } else {
        res.status(200).json('Get all my games');
      }
    } catch (error) {
      next(error);
    }
  };

  static createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opponentId = req.body.opponentId as number;
      const creatorId = req.userId as number;

      if (creatorId === opponentId) {
        throw new AppError('You can not create a game with yourself', 400);
      }

      const opponent = await UsersService.findById(opponentId);

      if (opponent === null) {
        throw new AppError('Opponent not found', 400);
      }

      const conflict = await GamesService.findUnfinishedGameForTwoUsers(creatorId, opponentId);

      if (conflict) {
        throw new AppError('Game with this user is already created', 400);
      }

      const game = await GamesService.createGame(creatorId, opponentId);
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  };

  static infoAboutGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId as number;
      const gameId = Number(req.params.gameId);
      console.log('gameId: ', gameId);

      const game = await GamesService.findById(gameId);
      if (!game) {
        throw new AppError('Game not found', 404);
      }
      const isMember = await GamesService.isMember(gameId, userId);
      if (!isMember) {
        throw new AppError('You are not a member of this game', 403);
      }

      if (game.creatorId === userId) {
        const gameForCreator: creatorGame = {
          id: game.id,
          creatorId: game.creatorId,
          opponentId: game.opponentId,
          status: game.status,
          winnerId: game.winnerId,
          hiddenByCreator: game.hiddenByCreator,
          hiddenLength: game.hiddenLength,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          steps: game.steps,
        };
        res.status(200).json(gameForCreator);
      } else {
        const gameForOpponent: opponentGame = {
          id: game.id,
          creatorId: game.creatorId,
          opponentId: game.opponentId,
          status: game.status,
          winnerId: game.winnerId,
          hiddenByOpponent: game.hiddenByOpponent,
          hiddenLength: game.hiddenLength,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          steps: game.steps,
        };
        res.status(200).json(gameForOpponent);
      }
    } catch (error) {
      next(error);
    }
  };

  static changeOpponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newOpponentId = req.body.opponentId;

      console.log('opponentId: ', newOpponentId);

      res.status(200).json(newOpponentId);
    } catch (error) {
      next(error);
    }
  };

  static deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Game deleted');
      res.status(200).json('Game deleted');
    } catch (error) {
      next(error);
    }
  };

  static hidden = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hidden = req.body.hidden;

      console.log('hidden: ', hidden);

      res.status(200).json(hidden);
    } catch (error) {
      next(error);
    }
  };

  static step = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stepValue = req.body.stepValue;

      console.log('stepValue: ', stepValue);

      res.status(200).json({
        step: stepValue,
      });
    } catch (error) {
      next(error);
    }
  };

  static changeSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hiddenLength = req.body.hiddenLength;

      console.log('hiddenLength: ', hiddenLength);

      res.status(200).json(hiddenLength);
    } catch (error) {
      next(error);
    }
  };
}
