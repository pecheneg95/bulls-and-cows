import { DeleteResult } from 'typeorm';

import { GameForCreator, GameForOpponent, GAME_STATUS, SORT_DIRECTION } from './games.constants';
import { GamesRepository } from 'games/games.repository';
import { Game } from './game.entity';
import { Step } from './step.entity';
import { BadRequestError, ForbiddenError, GAMES_ERROR_MESSAGE, NotFoundError } from '@errors';

export class GamesService {
  static async findById(id: number): Promise<Game | null> {
    return GamesRepository.findById(id);
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
    userIds: number[] | null,
    gameStatus: GAME_STATUS,
    sortType: SORT_DIRECTION,
    offset: number,
    limit: number
  ): Promise<{
    totalCount: number;
    games: (Game | GameForCreator | GameForOpponent)[];
  }> {
    const games = await GamesRepository.getAllGamesWithParams(userId, userIds, gameStatus, sortType, offset, limit);

    if (games) {
      const result = {
        totalCount: games[1],
        games: games[0].map((el) => {
          return this.getGameForUserByRoleInGame(userId, el);
        }),
      };

      return result;
    }

    return { totalCount: 0, games: [] };
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

    return GamesRepository.setWinner(game);
  }

  static async changeStatus(game: Game, status: GAME_STATUS): Promise<Game> {
    return GamesRepository.changeStatus(game, status);
  }

  static async getLastStepInGame(gameId: number): Promise<Step | null> {
    return GamesRepository.getLastStepInGame(gameId);
  }

  static async getStepsForGame(gameId: number): Promise<Step[] | null> {
    return GamesRepository.stepFindByGameId(gameId);
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
    let game = await this.findById(gameId);

    if (!game) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    const isMember = this.isMemberGame(game, userId);

    if (!isMember) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
    }

    if (game.status === GAME_STATUS.FINISHED) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_STEP_AFTER_FINISHED);
    }

    if (stepValue.length !== game.hiddenLength) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.INCORRECT_STEP_LENGTH);
    }

    const lastStep = await this.getLastStepInGame(gameId);

    if (lastStep && lastStep.userId === userId) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_YOU_TURN);
    }

    /* The game is considered started after the opponent makes a move 
    (gives you the opportunity to change the already guessed value before making moves) */
    if (game.status === GAME_STATUS.CREATED && game.hiddenByCreator && game.hiddenByOpponent) {
      game.status = (await this.changeStatus(game, GAME_STATUS.PLAYING)).status;
    }

    const { bulls, cows } = this.calculateBullsAndCows(userId, game, stepValue);
    const sequence = lastStep ? lastStep.sequence + 1 : 1;

    const curentStep = await GamesRepository.stepCreate(userId, game, sequence, stepValue, bulls, cows);

    const userHidden = (userId === game.creatorId ? game.hiddenByCreator : game.hiddenByOpponent) as string;
    const enemyHidden = (userId === game.creatorId ? game.hiddenByOpponent : game.hiddenByCreator) as string;

    if (lastStep && lastStep.value === userHidden) {
      game.status = (await this.changeStatus(game, GAME_STATUS.FINISHED)).status;

      game = await this.calculateWinner(game, lastStep, curentStep);
    }

    return {
      step: curentStep,
      isCorrect: enemyHidden === stepValue,
      isGameOver: game.status === GAME_STATUS.FINISHED,
    };
  }

  static async deleteGame(gameId: number, userId: number): Promise<DeleteResult> {
    const game = await this.findById(gameId);

    if (!game) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    const isCreator = this.isCreatorGame(game, userId);

    if (!isCreator) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_CREATOR);
    }

    if (game.status === GAME_STATUS.PLAYING) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_DELETE_AFTER_START);
    }

    if (game.status === GAME_STATUS.FINISHED) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_DELETE_FINISHED);
    }

    return GamesRepository.delete(gameId);
  }

  static async changeSettings(gameId: number, hiddenLength: number): Promise<Game> {
    const game = await this.findById(gameId);

    if (!game) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    if (game.status === GAME_STATUS.PLAYING || game.hiddenByCreator || game.hiddenByOpponent) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_CHANGE_SETTINGS_AFTER_START);
    }

    if (game.status === GAME_STATUS.FINISHED) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_CHANGE_SETTINGS_FINISHED);
    }

    return GamesRepository.changeSettings(game, hiddenLength);
  }

  static async setHidden(
    gameId: number,
    userId: number,
    hidden: string
  ): Promise<Game | GameForCreator | GameForOpponent> {
    const game = await this.findById(gameId);

    if (!game) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    const isMember = this.isMemberGame(game, userId);

    if (!isMember) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
    }

    if (game.status === GAME_STATUS.PLAYING) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_CHANGE_HIDDEN_AFTER_START);
    }

    if (game.status === GAME_STATUS.FINISHED) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_CHANGE_HIDDEN_FINISHED);
    }

    if (hidden.length !== game.hiddenLength) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.INCORRECT_ANSWER_LENGTH);
    }

    const updatedGame = await GamesRepository.setHidden(game, userId, hidden);

    return this.getGameForUserByRoleInGame(userId, updatedGame);
  }

  static async changeOpponent(gameId: number, userId: number, newOpponentId: number): Promise<Game> {
    const game = await this.findById(gameId);

    if (!game) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    const isCreator = this.isCreatorGame(game, userId);

    if (!isCreator) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_CREATOR);
    }

    const unfinishedGame = await this.findUnfinishedGameForTwoUsers(userId, newOpponentId);

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

    return GamesRepository.changeOpponent(game, newOpponentId);
  }

  static async createGame(creatorId: number, opponentId: number): Promise<Game> {
    if (creatorId === opponentId) {
      throw new BadRequestError(GAMES_ERROR_MESSAGE.NOT_WITH_YOURSELF);
    }

    const opponent = await this.findById(opponentId);

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
    return GamesRepository.stepFindByGameId(gameId);
  }

  static isMemberGame(game: Game, userId: number): boolean {
    return userId === game.creatorId || userId === game.opponentId;
  }

  static isCreatorGame(game: Game, userId: number): boolean {
    return userId === game.creatorId;
  }

  static getGameForUserByRoleInGame(userId: number, game: Game): GameForCreator | GameForOpponent | Game {
    const isMember = this.isMemberGame(game, userId);

    if (!isMember) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
    }

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
}
