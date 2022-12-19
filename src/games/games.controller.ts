import { NextFunction, Response } from 'express';

import {
  ChangeOpponentSanitizedRequest,
  ChangeSettingsSanitizedRequest,
  CreateGameSanitizedRequest,
  DeleteGameSanitizedRequest,
  GetAllMyGamesSanitizedRequest,
  GetGameSanitizedRequest,
  MakeStepSanitizedRequest,
  SetHiddenSanitizedRequest,
} from './games.types';
import { GamesService } from './games.service';

export class GamesController {
  static async getAllMyGames(req: GetAllMyGamesSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const userIds = req.query.userIds;
      const gameStatus = req.query.status;
      const sortDirection = req.query.sortDirection;
      const offset = req.query.offset;
      const limit = req.query.limit;

      const result = await GamesService.getAllGamesWithParams(
        userId,
        offset,
        limit,
        userIds,
        gameStatus,
        sortDirection
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createGame(req: CreateGameSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const opponentId = req.body.opponentId;
      const creatorId = req.userId;

      const game = await GamesService.createGame(creatorId, opponentId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async getGame(req: GetGameSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const gameId = req.params.gameId;

      const game = await GamesService.getGame(gameId, userId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async changeOpponent(req: ChangeOpponentSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const newOpponentId = req.body.opponentId;
      const gameId = req.params.gameId;

      const updatedGame = await GamesService.changeOpponent(gameId, userId, newOpponentId);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async deleteGame(req: DeleteGameSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const gameId = req.params.gameId;

      await GamesService.deleteGame(gameId, userId);

      res.status(200);
    } catch (error) {
      next(error);
    }
  }

  static async setHidden(req: SetHiddenSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const hidden = req.body.hidden;
      const userId = req.userId;
      const gameId = req.params.gameId;

      const updatedGame = await GamesService.setHidden(gameId, userId, hidden);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async makeStep(req: MakeStepSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;
      const gameId = req.params.gameId;
      const stepValue = req.body.stepValue;

      const result = await GamesService.makeStep(userId, gameId, stepValue);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async changeSettings(req: ChangeSettingsSanitizedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const hiddenLength = req.body.hiddenLength;
      const gameId = req.params.gameId;

      const updatedGame = await GamesService.changeSettings(gameId, hiddenLength);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }
}
