import { NextFunction, Request, Response } from 'express';

import { GAME_STATUS } from './games.constants';
import { GamesService } from './games.service';

export class GamesController {
  static async getAllMyGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const userIdsFromQuery = req.query.userIds as string | string[];
      const gameStatus = req.query.status as GAME_STATUS;
      const sortType = req.query.sort?.['type'];
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 20;

      let userIds: number[] | null = null;

      if (Array.isArray(userIdsFromQuery)) {
        userIds = userIdsFromQuery.map((el: string) => Number(el));
      } else if (userIdsFromQuery) {
        userIds = [Number(userIdsFromQuery)];
      }

      const result = await GamesService.getAllGamesWithParams(userId, userIds, gameStatus, sortType, offset, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const opponentId = Number(req.body.opponentId);
      const creatorId = Number(req.userId);

      const game = await GamesService.createGame(creatorId, opponentId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async getGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      console.log(req.role);

      const game = await GamesService.getGame(gameId, userId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async changeOpponent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const newOpponentId = Number(req.body.opponentId);
      const gameId = Number(req.params.gameId);

      const updatedGame = await GamesService.changeOpponent(gameId, userId, newOpponentId);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async deleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);

      await GamesService.deleteGame(gameId, userId);

      res.status(200);
    } catch (error) {
      next(error);
    }
  }

  static async setHidden(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hidden = String(req.body.hidden);
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);

      const updatedGame = await GamesService.setHidden(gameId, userId, hidden);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async makeStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const stepValue = String(req.body.stepValue);

      const result = await GamesService.makeStep(userId, gameId, stepValue);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async changeSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hiddenLength = Number(req.body.hiddenLength);
      const gameId = Number(req.params.gameId);

      const updatedGame = await GamesService.changeSettings(gameId, hiddenLength);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }
}
