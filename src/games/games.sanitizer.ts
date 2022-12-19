import { Response, NextFunction } from 'express';

import { SORT_DIRECTION } from '@users';

import {
  ChangeOpponentRequest,
  ChangeSettingsRequest,
  CreateGameRequest,
  DeleteGameRequest,
  GetAllMyGamesRequest,
  GetGameRequest,
  MakeStepRequest,
  SetHiddenRequest,
} from './games.types';
import { DEFAULT_GAMES_LIMIT, DEFAULT_GAMES_OFFSET, GAME_STATUS } from './games.constants';

export class GamesSanitizer {
  static getAllMyGames(req: GetAllMyGamesRequest, res: Response, next: NextFunction): void {
    try {
      if (req.query.status) {
        req.query.status = req.query.status as GAME_STATUS;
      }

      if (req.query.sortDirection) {
        req.query.sortDirection = req.query.sortDirection as SORT_DIRECTION;
      }

      if (req.query.userIds) {
        const userIdsFromQuery = req.query.userIds;

        if (Array.isArray(userIdsFromQuery)) {
          req.query.userIds = userIdsFromQuery.map((el) => Number(el));
        } else if (userIdsFromQuery) {
          req.query.userIds = [Number(userIdsFromQuery)];
        }
      }

      req.query.offset = Number(req.query.offset) || DEFAULT_GAMES_OFFSET;
      req.query.limit = Number(req.query.limit) || DEFAULT_GAMES_LIMIT;

      next();
    } catch (error) {
      next(error);
    }
  }

  static createGame(req: CreateGameRequest, res: Response, next: NextFunction): void {
    try {
      req.body.opponentId = Number(req.body.opponentId);

      next();
    } catch (error) {
      next(error);
    }
  }

  static getGame(req: GetGameRequest, res: Response, next: NextFunction): void {
    try {
      req.params.gameId = Number(req.params.gameId);

      next();
    } catch (error) {
      next(error);
    }
  }

  static changeOpponent(req: ChangeOpponentRequest, res: Response, next: NextFunction): void {
    try {
      req.body.opponentId = Number(req.body.opponentId);
      req.params.gameId = Number(req.params.gameId);

      next();
    } catch (error) {
      next(error);
    }
  }

  static deleteGame(req: DeleteGameRequest, res: Response, next: NextFunction): void {
    try {
      req.params.gameId = Number(req.params.gameId);

      next();
    } catch (error) {
      next(error);
    }
  }

  static setHidden(req: SetHiddenRequest, res: Response, next: NextFunction): void {
    try {
      req.params.gameId = Number(req.params.gameId);

      next();
    } catch (error) {
      next(error);
    }
  }

  static makeStep(req: MakeStepRequest, res: Response, next: NextFunction): void {
    try {
      req.params.gameId = Number(req.params.gameId);

      next();
    } catch (error) {
      next(error);
    }
  }
  static changeSettings(req: ChangeSettingsRequest, res: Response, next: NextFunction): void {
    try {
      req.body.hiddenLength = Number(req.body.hiddenLength);
      req.params.gameId = Number(req.params.gameId);

      next();
    } catch (error) {
      next(error);
    }
  }
}
