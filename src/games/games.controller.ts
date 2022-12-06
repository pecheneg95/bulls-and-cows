import { NextFunction, Request, Response } from 'express';

import { BadRequestError, ForbiddenError, GAMES_ERROR_MESSAGE, InternalServerError, NotFoundError } from '@errors';

import { UsersService } from '@users';

import { GAME_STATUS } from './games.constants';
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

      let userIds: number[] | null = null;

      if (Array.isArray(userIdsFromQuery)) {
        userIds = userIdsFromQuery.map((el: string) => Number(el));
      } else if (userIdsFromQuery) {
        userIds = [Number(userIdsFromQuery)];
      }

      const result = await GamesService.getAllGamesWithParams(userId, userIds, gameStatus, sortType, offset, limit);

      if (!result) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.NO_GAMES);
      }

      const { totalCount, games } = result;

      const clearGames = games.map((el) => {
        return GamesService.getGameForUserByRoleInGame(userId, el);
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
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_WITH_YOURSELF);
      }

      const opponent = await UsersService.findById(opponentId);

      if (!opponent) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.OPPONENT_NOT_FOUND);
      }

      const unfinishedGame = await GamesService.findUnfinishedGameForTwoUsers(creatorId, opponentId);

      if (unfinishedGame) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.GAME_ALREADY_CREATED);
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
      const game = await GamesService.findById(gameId);

      if (!game) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }

      GamesService.checkIsMemberGame(game, userId);

      const gameForUser = GamesService.getGameForUserByRoleInGame(userId, game);

      res.status(200).json(gameForUser);
    } catch (error) {
      next(error);
    }
  }

  static async changeOpponent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const newOpponentId = Number(req.body.opponentId);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findById(gameId);

      if (!game) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }

      GamesService.checkIsCreatorGame(game, userId);

      const unfinishedGame = await GamesService.findUnfinishedGameForTwoUsers(userId, newOpponentId);

      if (unfinishedGame) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.GAME_ALREADY_CREATED);
      }

      if (game.status !== GAME_STATUS.CREATED) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_CHANGE_OPPONENT_AFTER_START);
      }

      if (game.creatorId === newOpponentId) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_WITH_YOURSELF);
      }

      if (game.opponentId === newOpponentId) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.GAME_ALREADY_CREATED);
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
      const game = await GamesService.findById(gameId);

      if (!game) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }

      GamesService.checkIsCreatorGame(game, userId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_DELETE_AFTER_START);
      }

      if (game.status === GAME_STATUS.FINISHED) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_DELETE_FINISHED);
      }

      const deleteResult = await GamesService.deleteGame(gameId);

      if (!deleteResult) {
        throw new InternalServerError(GAMES_ERROR_MESSAGE.GAME_NOT_DELETED);
      }

      res.status(200).json('Game deleted');
    } catch (error) {
      next(error);
    }
  }

  static async setHidden(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hidden = String(req.body.hidden);
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findById(gameId);

      if (!game) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }

      GamesService.checkIsMemberGame(game, userId);

      if (game.status === GAME_STATUS.PLAYING) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_CHANGE_HIDDEN_AFTER_START);
      }

      if (game.status === GAME_STATUS.FINISHED) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_CHANGE_HIDDEN_FINISHED);
      }

      if (hidden.length !== game.hiddenLength) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.INCORRECT_ANSWER_LENGTH);
      }

      const updatedGame = await GamesService.setHidden(game, userId, hidden);

      const gameForUser = GamesService.getGameForUserByRoleInGame(userId, updatedGame);

      res.status(200).json(gameForUser);
    } catch (error) {
      next(error);
    }
  }

  static async makeStep(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const stepValue = String(req.body.stepValue);

      const game = await GamesService.findById(gameId);

      if (!game) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }

      GamesService.checkIsMemberGame(game, userId);

      if (game.status === GAME_STATUS.FINISHED) {
        throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_STEP_AFTER_FINISHED);
      }

      if (stepValue.length !== game.hiddenLength) {
        throw new BadRequestError(GAMES_ERROR_MESSAGE.INCORRECT_STEP_LENGTH);
      }

      const lastStep = await GamesService.getLastStepInGame(gameId);

      if (lastStep) {
        if (lastStep.userId === userId) {
          throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_YOU_TURN);
        }
      }

      /* The game is considered started after the opponent makes a move 
      (gives you the opportunity to change the already guessed value before making moves) */
      if (game.status === GAME_STATUS.CREATED && game.hiddenByCreator && game.hiddenByOpponent) {
        game.status = (await GamesService.changeStatus(game, GAME_STATUS.PLAYING)).status;
      }

      const userHidden = (userId === game.creatorId ? game.hiddenByCreator : game.hiddenByOpponent) as string;
      const enemyHidden = (userId === game.creatorId ? game.hiddenByOpponent : game.hiddenByCreator) as string;
      const curentStep = await GamesService.makeStep(userId, game, stepValue);

      if (lastStep && lastStep.value === userHidden) {
        game.status = (await GamesService.changeStatus(game, GAME_STATUS.FINISHED)).status;

        await GamesService.calculateWinner(game, lastStep, curentStep);
      }

      res.status(200).json({
        step: curentStep,
        isCorrect: enemyHidden === stepValue,
        isGameOver: game.status === GAME_STATUS.FINISHED,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hiddenLength = Number(req.body.hiddenLength);
      const gameId = Number(req.params.gameId);
      const game = await GamesService.findById(gameId);

      if (!game) {
        throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }

      if (game.status === GAME_STATUS.PLAYING || game.hiddenByCreator || game.hiddenByOpponent) {
        throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_CHANGE_SETTINGS_AFTER_START);
      }

      if (game.status === GAME_STATUS.FINISHED) {
        throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_CHANGE_SETTINGS_FINISHED);
      }

      const updatedGame = await GamesService.changeSettings(game, hiddenLength);

      res.status(200).json(updatedGame);
    } catch (error) {
      next(error);
    }
  }
}
