import { NextFunction, Request, Response } from 'express';

import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from '@errors';

import { UsersService } from '@users';

import { GameForCreator, GameForOpponent, GAME_STATUS } from './games.constants';
import { GamesService } from './games.service';

export class GamesController {
  static async getAllMyGames(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const userIdsFromQuery = req.query.userIds as string | string[];
      const gameStatus = req.query.status as GAME_STATUS;
      const sortType = String(req.query.sortType);
      const offset = Number(req.query.offset);
      const limit = Number(req.query.limit);

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

      const result = await GamesService.getAllGamesWithParams(userId, userIds, gameStatus, sortType, offset, limit);

      if (!result) {
        throw new NotFoundError('You are not have a games');
      }

      const { totalCount, games } = result;

      const clearGames: (GameForCreator | GameForOpponent)[] = games.map((el) => {
        if (userId === el.creatorId) {
          return GamesService.getClearGameObjectForCreator(el);
        }

        return GamesService.getClearGameObjectForOpponent(el);
      });

      res.status(200).json({ totalCount: totalCount, games: clearGames });
    } catch (error) {
      next(error);
    }
  }

  static async createGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const opponentId = Number(req.body.opponentId);
      const creatorId = Number(req.userId);

      if (creatorId === opponentId) {
        throw new BadRequestError('You can not create a game with yourself');
      }

      const opponent = await UsersService.findById(opponentId);

      if (!opponent) {
        throw new BadRequestError('Opponent not found');
      }

      const unfinishedGame = await GamesService.findUnfinishedGameForTwoUsers(creatorId, opponentId);

      if (unfinishedGame) {
        throw new BadRequestError('Game with this user is already created');
      }

      const game = await GamesService.createGame(creatorId, opponentId);

      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }

  static async getInfoAboutGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

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
  }

  static async changeOpponent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const newOpponentId = Number(req.body.opponentId);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.creatorId === newOpponentId) {
        throw new BadRequestError('You cannot choose yourself as an opponent');
      }

      if (game.opponentId === newOpponentId) {
        throw new BadRequestError('Game with this user is already created');
      }

      const updatedGame = await GamesService.changeOpponent(game, newOpponentId);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }

  static async deleteGame(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new BadRequestError('You cannot delete game after game start');
      }

      if (game.status === GAME_STATUS.FINISHED) {
        throw new BadRequestError('You cannot delete finished game');
      }

      const deleteResult = await GamesService.deleteGame(gameId);

      if (!deleteResult) {
        throw new InternalServerError('Sorry, game is not deleted');
      }

      res.status(200).json('Game deleted');
    } catch (error) {
      next(error);
    }
  }

  static async makeHidden(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hidden = String(req.body.hidden);
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new BadRequestError('You cannot change answer after game start');
      }

      if (game.status === GAME_STATUS.FINISHED) {
        throw new BadRequestError('You cannot change answer in finished game');
      }

      if (hidden.length !== game.hiddenLength) {
        throw new BadRequestError('Incorrect answer length');
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
  }

  static async makeStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const stepValue = String(req.body.stepValue);

      const game = await GamesService.findByIdOrFail(gameId);

      GamesService.isMemberGame(game, userId);

      if (game.status === GAME_STATUS.FINISHED) {
        throw new ForbiddenError('You cannot make a move after the game is over');
      }

      if (stepValue.length !== game.hiddenLength) {
        throw new BadRequestError('Incorrect step length');
      }

      const pastSteps = await GamesService.findStepsForGame(gameId);

      if (pastSteps) {
        if (pastSteps.length > 0 && pastSteps[pastSteps.length - 1].userId === userId) {
          throw new ForbiddenError("It's not your turn to make a move");
        }

        // Opponent goes first
        if (pastSteps.length === 0 && userId === game.creatorId) {
          throw new ForbiddenError("It's not your turn to make a move");
        }
      }

      if (game.status === GAME_STATUS.CREATED && game.hiddenByCreator && game.hiddenByOpponent) {
        game.status = (await GamesService.changeStatus(game, GAME_STATUS.PLAYING)).status;
      }

      const step = await GamesService.step(userId, game, stepValue);
      const userHidden = (userId === game.creatorId ? game.hiddenByCreator : game.hiddenByOpponent) as string;
      const enemyHidden = (userId === game.creatorId ? game.hiddenByOpponent : game.hiddenByCreator) as string;

      if (pastSteps && pastSteps.length > 0) {
        if (
          (userId === game.creatorId && pastSteps[pastSteps.length - 1].value === userHidden) ||
          (userId === game.opponentId && pastSteps[pastSteps.length - 1].value === userHidden)
        ) {
          const lastSteps = [pastSteps[pastSteps.length - 1].value, step.value];

          game.status = (await GamesService.changeStatus(game, GAME_STATUS.FINISHED)).status;

          await GamesService.calculateWinner(game, lastSteps);
        }
      }

      res.status(200).json({
        step: step,
        isCorrect: enemyHidden === stepValue,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hiddenLength = Number(req.body.hiddenLength);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findByIdOrFail(gameId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new ForbiddenError('You cannot change settings after game start');
      }
      if (game.status === GAME_STATUS.FINISHED) {
        throw new ForbiddenError('You cannot change settings in finished game');
      }
      if (game.hiddenByCreator || game.hiddenByOpponent) {
        throw new ForbiddenError('You cannot change the settings after the players guessed the numbers');
      }

      const updatedGame = await GamesService.changeSettings(game, hiddenLength);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }
}
