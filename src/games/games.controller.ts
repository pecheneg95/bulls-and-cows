import { AppError } from '@errors';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'users/users.service';
import { GAME_STATUS } from './games.constants';
import { GamesService } from './games.service';

export class GamesController {
  static getAllMyGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Get all me games');
      const userId = Number(req.userId);
      const userIdsFromQuery = req.query.userIds as string | string[];
      let userIds: number[] | null;
      if (userIdsFromQuery) {
        if (!Array.isArray(userIdsFromQuery)) {
          userIds = [Number(userIdsFromQuery)];
        } else {
          userIds = userIdsFromQuery.map((el: string) => Number(el));
        }
      } else {
        userIds = null;
      }
      const gameStatus = req.query.status as GAME_STATUS;
      const sortType = String(req.query.sortType);
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);
      console.log('userId: ', userId);
      console.log('userIds: ', userIds);
      console.log('gameStatus: ', gameStatus);
      console.log('sortType: ', sortType);
      console.log('offset: ', offset);
      console.log('limit: ', limit);

      const result = await GamesService.getAllGamesWithParams(userId, userIds, gameStatus, sortType, offset, limit);
      if (result) {
        const { totalCount, games } = result;
        if (games) {
          const clearGames: any = games.map((el) => {
            if (userId === el.creatorId) {
              return GamesService.getClearGameObjectForCreator(el);
            } else {
              return GamesService.getClearGameObjectForOpponent(el);
            }
          });
          res.status(200).json({ totalCount: totalCount, games: clearGames });
        }
      }
    } catch (error) {
      next(error);
    }
  };

  static createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opponentId = Number(req.body.opponentId);
      const creatorId = Number(req.userId);
      console.log('opponentId: ', opponentId);
      console.log('creatorId: ', creatorId);

      if (creatorId === opponentId) {
        throw new AppError('You can not create a game with yourself', 400);
      }

      const opponent = await UsersService.findById(opponentId);
      if (!opponent) {
        throw new AppError('Opponent not found', 400);
      }

      const unfinishedGame = await GamesService.findUnfinishedGameForTwoUsers(creatorId, opponentId);
      if (unfinishedGame) {
        throw new AppError('Game with this user is already created', 400);
      }

      const game = await GamesService.createGame(creatorId, opponentId);
      console.log('Game has be created');
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  };

  static infoAboutGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      console.log('Game info sent');
      if (game.creatorId === userId) {
        const gameForCreator = GamesService.getClearGameObjectForCreator(game);
        res.status(200).json(gameForCreator);
      } else {
        const gameForOpponent = GamesService.getClearGameObjectForOpponent(game);
        res.status(200).json(gameForOpponent);
      }
    } catch (error) {
      next(error);
    }
  };

  static changeOpponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const newOpponentId = Number(req.body.opponentId);
      const gameId = Number(req.params.gameId);
      console.log('userId: ', userId);
      console.log('newOpponentId: ', newOpponentId);
      console.log('gameId: ', gameId);

      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.creatorId === newOpponentId) {
        throw new AppError('You cannot choose yourself as an opponent', 400);
      }

      if (game.opponentId === newOpponentId) {
        throw new AppError('Game with this user is already created', 400);
      }
      const updatedGame = await GamesService.changeOpponent(game, newOpponentId);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  };

  static deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      console.log('userId: ', userId);
      console.log('gameId: ', gameId);
      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new AppError('You cannot delete game after game start', 400);
      }
      if (game.status === GAME_STATUS.FINISHED) {
        throw new AppError('You cannot delete finished game', 400);
      }

      console.log('Game deleted');
      res.status(200).json('Game deleted');
    } catch (error) {
      next(error);
    }
  };

  static hidden = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hidden = String(req.body.hidden);
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      console.log('hidden: ', hidden);
      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new AppError('You cannot change answer after game start', 400);
      }
      if (game.status === GAME_STATUS.FINISHED) {
        throw new AppError('You cannot change answer in finished game', 400);
      }
      if (hidden.length !== game.hiddenLength) {
        throw new AppError('Incorrect answer length', 400);
      }

      const updatedGame = await GamesService.hidden(game, userId, hidden);
      if (updatedGame.creatorId === userId) {
        const gameForCreator = GamesService.getClearGameObjectForCreator(updatedGame);
        res.status(200).json(gameForCreator);
      }
      if (updatedGame.opponentId === userId) {
        const gameForOpponent = GamesService.getClearGameObjectForOpponent(updatedGame);
        res.status(200).json(gameForOpponent);
      }
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
      const hiddenLength = Number(req.body.hiddenLength);
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      console.log('hiddenLength: ', hiddenLength);
      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      const game = await GamesService.findByIdOrFail(gameId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new AppError('You cannot change settings after game start', 400);
      }
      if (game.status === GAME_STATUS.FINISHED) {
        throw new AppError('You cannot change settings in finished game', 400);
      }
      if (game.hiddenByCreator || game.hiddenByOpponent) {
        throw new AppError('You cannot change the settings after the players guessed the numbers', 400);
      }

      const updatedGame = await GamesService.changeSettings(game, hiddenLength);
      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  };
}
