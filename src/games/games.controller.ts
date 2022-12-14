import { NextFunction, Response, Request } from 'express';
import { DEFAULT_GAMES_LIMIT, DEFAULT_GAMES_OFFSET, GAME_STATUS, SORT_DIRECTION } from './games.constants';
import { GamesService } from './games.service';

export class GamesController {
  static async getAllMyGames(
    req: Request<
      unknown,
      unknown,
      unknown,
      {
        userIds: string | string[];
        status: GAME_STATUS;
        sortDirection: SORT_DIRECTION;
        offset: string;
        limit: string;
      }
    >,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      const userIdsFromQuery = req.query.userIds;
      const gameStatus = req.query.status;
      const sortDirection = req.query.sortDirection;
      const offset = Number(req.query.offset) || DEFAULT_GAMES_OFFSET;
      const limit = Number(req.query.limit) || DEFAULT_GAMES_LIMIT;

      let userIds: number[] | null = null;

      if (Array.isArray(userIdsFromQuery)) {
        userIds = userIdsFromQuery.map((el) => Number(el));
      } else if (userIdsFromQuery) {
        userIds = [Number(userIdsFromQuery)];
      }

      const result = await GamesService.getAllGamesWithParams(
        userId,
        userIds,
        gameStatus,
        sortDirection,
        offset,
        limit
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createGame(
    req: Request<unknown, unknown, { opponentId: string }, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const opponentId = Number(req.body.opponentId);
      const creatorId = req.userId;

      const game = await GamesService.createGame(creatorId, opponentId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async getGame(
    req: Request<{ gameId: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      const gameId = Number(req.params.gameId);

      const game = await GamesService.getGame(gameId, userId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async changeOpponent(
    req: Request<{ gameId: string }, unknown, { opponentId: string }, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      const newOpponentId = Number(req.body.opponentId);
      const gameId = Number(req.params.gameId);

      const updatedGame = await GamesService.changeOpponent(gameId, userId, newOpponentId);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async deleteGame(
    req: Request<{ gameId: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      const gameId = Number(req.params.gameId);

      await GamesService.deleteGame(gameId, userId);

      res.status(200);
    } catch (error) {
      next(error);
    }
  }

  static async setHidden(
    req: Request<{ gameId: string }, unknown, { hidden: string }, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const hidden = req.body.hidden;
      const userId = req.userId;
      const gameId = Number(req.params.gameId);

      const updatedGame = await GamesService.setHidden(gameId, userId, hidden);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async makeStep(
    req: Request<{ gameId: string }, unknown, { stepValue: string }, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.userId;
      const gameId = Number(req.params.gameId);
      const stepValue = req.body.stepValue;

      const result = await GamesService.makeStep(userId, gameId, stepValue);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async changeSettings(
    req: Request<{ gameId: string }, unknown, { hiddenLength: string }, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
