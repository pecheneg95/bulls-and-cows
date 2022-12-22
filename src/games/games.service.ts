import { DeleteResult } from 'typeorm';

import { BadRequestError, ForbiddenError, GAMES_ERROR_MESSAGE, NotFoundError } from '@errors';

import { GameForCreator, GameForOpponent } from './games.types';
import { GAME_STATUS, SORT_DIRECTION } from './games.constants';
import { GamesRepository } from './games.repository';
import { StepsRepository } from './steps.repository';
import { Game } from './game.entity';
import { Step } from './step.entity';
import { UsersRepository } from '@users';

export class GamesService {
  static async findById(id: number): Promise<Game | null> {
    return GamesRepository.findById(id);
  }

  static async findByIdOrFail(id: number): Promise<Game> {
    const game = await GamesRepository.findById(id);

    if (!game) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    return game;
  }

  static async getGame(
    gameId: number,
    userId: number
  ): Promise<{ gameForUser: Game | GameForCreator | GameForOpponent | null; steps: Step[] | null }> {
    const game = await this.findById(gameId);

    if (!game) {
      return { gameForUser: null, steps: null };
    }

    const gameForUser = this.getGameForUserByRoleInGame(userId, game);
    const steps = await this.getStepsForGame(gameId);

    return { gameForUser, steps };
  }

  static async getAllGamesWithParams(
    userId: number,
    offset: number,
    limit: number,
    userIds?: number[],
    gameStatus?: GAME_STATUS,
    sortDirection?: SORT_DIRECTION
  ): Promise<{
    totalCount: number;
    games: (Game | GameForCreator | GameForOpponent)[];
  }> {
    const games = await GamesRepository.getAllGamesWithParams(
      userId,
      offset,
      limit,
      userIds,
      gameStatus,
      sortDirection
    );

    const result = {
      totalCount: games[1],
      games: games[0].map((el) => {
        return this.getGameForUserByRoleInGame(userId, el);
      }),
    };

    return result;
  }

  static async getAllGamesForUser(userId: number, from?: Date, to?: Date): Promise<Game[] | null> {
    if (from && to) {
      return GamesRepository.findByUserIdWithDate(userId, from, to);
    }

    return GamesRepository.findByUserId(userId);
  }

  static async calculateWinner(game: Game, lastStep: Step, currentStep: Step): Promise<Game> {
    const { creatorId, opponentId, hiddenByCreator, hiddenByOpponent } = game;

    if (currentStep.userId === creatorId) {
      if (currentStep.value === hiddenByOpponent && lastStep.value !== hiddenByCreator) {
        return GamesRepository.setWinner(game, creatorId);
      }

      if (currentStep.value !== hiddenByOpponent && lastStep.value === hiddenByCreator) {
        return GamesRepository.setWinner(game, opponentId);
      }
    }

    if (currentStep.userId === opponentId) {
      if (currentStep.value === hiddenByCreator && lastStep.value !== hiddenByOpponent) {
        return GamesRepository.setWinner(game, opponentId);
      }

      if (currentStep.value !== hiddenByCreator && lastStep.value === hiddenByOpponent) {
        return GamesRepository.setWinner(game, creatorId);
      }
    }

    return game;
  }

  static async changeStatus(game: Game, status: GAME_STATUS): Promise<Game> {
    return GamesRepository.changeStatus(game, status);
  }

  static async getLastStepInGame(gameId: number): Promise<Step | null> {
    return StepsRepository.getLastStepInGame(gameId);
  }

  static async getStepsForGame(gameId: number): Promise<Step[] | null> {
    return StepsRepository.findByGameId(gameId);
  }

  static async makeStep(
    userId: number,
    gameId: number,
    stepValue: string
  ): Promise<{
    step: Step;
    isCorrect: boolean;
    isGameOver: boolean;
  }> {
    let game = await this.findByIdOrFail(gameId);

    this.isMemberGameOrFail(game, userId);
    this.gameIsNotFinishedOrFail(game);
    this.stepValueLengthIsValidOrFail(game, stepValue);

    const lastStep = await this.getLastStepInGame(gameId);

    this.isUserTurnOrFail(lastStep, userId);

    if (game.status === GAME_STATUS.CREATED && game.hiddenByCreator && game.hiddenByOpponent) {
      game.status = (await this.changeStatus(game, GAME_STATUS.PLAYING)).status;
    }

    const { bulls, cows } = this.calculateBullsAndCows(userId, game, stepValue);
    const sequence = lastStep ? lastStep.sequence + 1 : 1;

    const currentStep = await StepsRepository.create(userId, game.id, sequence, stepValue, bulls, cows);

    const userHidden = userId === game.creatorId ? game.hiddenByCreator : game.hiddenByOpponent;
    const enemyHidden = userId === game.creatorId ? game.hiddenByOpponent : game.hiddenByCreator;

    if (lastStep && lastStep.value === userHidden) {
      game.status = (await this.changeStatus(game, GAME_STATUS.FINISHED)).status;

      game = await this.calculateWinner(game, lastStep, currentStep);
    }

    return {
      step: currentStep,
      isCorrect: enemyHidden === stepValue,
      isGameOver: game.status === GAME_STATUS.FINISHED,
    };
  }

  static async deleteGame(gameId: number, userId: number): Promise<DeleteResult> {
    const game = await this.findByIdOrFail(gameId);

    this.isCreatorGameOrFail(game, userId);

    if (game.status !== GAME_STATUS.CREATED) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.CANNOT_DELETE);
    }

    return GamesRepository.delete(gameId);
  }

  static async changeSettings(gameId: number, hiddenLength: number): Promise<Game> {
    const game = await this.findByIdOrFail(gameId);

    if (game.status !== GAME_STATUS.CREATED || game.hiddenByCreator || game.hiddenByOpponent) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.CANNOT_CHANGE_SETTINGS);
    }

    return GamesRepository.changeSettings(game, hiddenLength);
  }

  static async setHidden(
    gameId: number,
    userId: number,
    hidden: string
  ): Promise<Game | GameForCreator | GameForOpponent> {
    const game = await this.findByIdOrFail(gameId);

    this.isMemberGameOrFail(game, userId);

    if (game.status !== GAME_STATUS.CREATED) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.CANNOT_CHANGE_HIDDEN);
    }

    if (hidden.length !== game.hiddenLength) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.INCORRECT_ANSWER_LENGTH);
    }

    const updatedGame = await GamesRepository.setHidden(game, userId, hidden);

    return this.getGameForUserByRoleInGame(userId, updatedGame);
  }

  static async changeOpponent(gameId: number, userId: number, newOpponentId: number): Promise<Game> {
    const game = await this.findByIdOrFail(gameId);

    this.isCreatorGameOrFail(game, userId);

    const opponent = await UsersRepository.findById(newOpponentId);

    if (!opponent) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.OPPONENT_NOT_FOUND);
    }

    const unfinishedGame = await this.findUnfinishedGameForTwoUsers(userId, newOpponentId);

    if (unfinishedGame) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.GAME_ALREADY_CREATED);
    }

    if (game.status !== GAME_STATUS.CREATED) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.CANNOT_CHANGE_OPPONENT);
    }

    if (game.creatorId === newOpponentId) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.CANNOT_WITH_YOURSELF);
    }

    if (game.opponentId === newOpponentId) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.GAME_ALREADY_CREATED);
    }

    return GamesRepository.changeOpponent(game, newOpponentId);
  }

  static async createGame(creatorId: number, opponentId: number): Promise<Game> {
    if (creatorId === opponentId) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.CANNOT_WITH_YOURSELF);
    }

    const opponent = await UsersRepository.findById(opponentId);

    if (!opponent) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.OPPONENT_NOT_FOUND);
    }

    const unfinishedGame = await this.findUnfinishedGameForTwoUsers(creatorId, opponentId);

    if (unfinishedGame) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.GAME_ALREADY_CREATED);
    }

    return GamesRepository.create(creatorId, opponentId);
  }

  static async findUnfinishedGameForTwoUsers(userId: number, opponentId: number): Promise<Game | null> {
    return GamesRepository.findUnfinishedGameForTwoUsers(userId, opponentId);
  }

  static async findStepsForGame(gameId: number): Promise<Step[] | null> {
    return StepsRepository.findByGameId(gameId);
  }

  static getGameForUserByRoleInGame(userId: number, game: Game): GameForCreator | GameForOpponent | Game {
    this.isMemberGameOrFail(game, userId);

    if (userId === game.creatorId) {
      return this.clearGameObjectForCreator(game);
    }

    if (userId === game.opponentId) {
      return this.clearGameObjectForOpponent(game);
    }

    return game;
  }

  static clearGameObjectForCreator(game: Game): GameForCreator {
    const gameForCreator: any = Object.assign({}, game);

    delete gameForCreator.hiddenByOpponent;

    return gameForCreator as GameForCreator;
  }

  static clearGameObjectForOpponent(game: Game): GameForOpponent {
    const gameForOpponent: any = Object.assign({}, game);

    delete gameForOpponent.hiddenByCreator;

    return gameForOpponent as GameForOpponent;
  }

  static calculateBullsAndCows(userId: number, game: Game, stepValue: string): { bulls: number; cows: number } {
    const checkHidden = (game.creatorId === userId ? game.hiddenByOpponent : game.hiddenByCreator) as string;

    let bulls = 0;
    let cows = 0;

    stepValue.split('').forEach((el, i) => {
      if (checkHidden.includes(el)) {
        if (i === checkHidden.indexOf(el)) {
          bulls++;
        } else {
          cows++;
        }
      }
    });

    return { bulls, cows };
  }

  static isMemberGameOrFail(game: Game, userId: number): void {
    if (!(userId === game.creatorId || userId === game.opponentId)) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
    }
  }

  static isCreatorGameOrFail(game: Game, userId: number): void {
    if (!(userId === game.creatorId)) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_CREATOR);
    }
  }
  static gameIsNotFinishedOrFail(game: Game): void {
    if (game.status === GAME_STATUS.FINISHED) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.CANNOT_MAKE_STEP_AFTER_FINISHED);
    }
  }

  static stepValueLengthIsValidOrFail(game: Game, stepValue: string): void {
    if (stepValue.length !== game.hiddenLength) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.INCORRECT_STEP_LENGTH);
    }
  }
  static isUserTurnOrFail(lastStep: Step | null, userId: number): void {
    if (lastStep && lastStep.userId === userId) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_YOU_TURN);
    }
  }
}
