import { DeleteResult } from 'typeorm';

import { ForbiddenError, GAMES_ERROR_MESSAGE, NotFoundError } from '@errors';

import { GameForCreator, GameForOpponent, GAME_STATUS } from './games.constants';
import { GamesRepository } from 'games/games.repository';
import { Game } from './game.entity';
import { Step } from './step.entity';

export class GamesService {
  static async findById(id: number): Promise<Game | null> {
    return GamesRepository.findById(id);
  }

  static async getAllGamesWithParams(
    userId: number,
    userIds: number[] | null,
    gameStatus: GAME_STATUS,
    sortType: string,
    offset: number,
    limit: number
  ): Promise<{
    totalCount: number;
    games: Game[];
  }> {
    const games = await GamesRepository.getAllGamesWithParams(userId, userIds, gameStatus);

    if (!games) {
      throw new NotFoundError(GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
    }

    return {
      totalCount: games.length,
      games: games
        .sort((a, b) => {
          if (sortType === 'desc') {
            return Number(b.createdAt) - Number(a.createdAt);
          } else {
            return Number(a.createdAt) - Number(b.createdAt);
          }
        })
        .slice(offset, offset + limit),
    };
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

  static async makeStep(userId: number, game: Game, stepValue: string): Promise<Step> {
    const { bulls, cows } = GamesService.calculateBullsAndCows(userId, game, stepValue);
    const lastStep = await GamesRepository.getLastStepInGame(game.id);
    console.log(lastStep);
    let sequence = 1;

    if (lastStep) {
      sequence += lastStep.sequence;
    }

    return GamesRepository.stepCreate(userId, game, sequence, stepValue, bulls, cows);
  }

  static async deleteGame(gameId: number): Promise<DeleteResult> {
    return GamesRepository.delete(gameId);
  }

  static async changeSettings(game: Game, hiddenLength: number): Promise<Game> {
    return GamesRepository.changeSettings(game, hiddenLength);
  }

  static async setHidden(game: Game, userId: number, hidden: string): Promise<Game> {
    return GamesRepository.setHidden(game, userId, hidden);
  }

  static async changeOpponent(game: Game, newOpponentId: number): Promise<Game> {
    return GamesRepository.changeOpponent(game, newOpponentId);
  }

  static async createGame(userId: number, opponentId: number): Promise<Game> {
    return GamesRepository.create(userId, opponentId);
  }

  static async findUnfinishedGameForTwoUsers(userId: number, opponentId: number): Promise<Game | null> {
    return GamesRepository.findUnfinishedGameForTwoUsers(userId, opponentId);
  }

  static async findStepsForGame(gameId: number): Promise<Step[] | null> {
    return GamesRepository.stepFindByGameId(gameId);
  }

  static checkIsMemberGame(game: Game, userId: number): void {
    if (userId !== game.creatorId && userId !== game.opponentId) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
    }
  }

  static checkIsCreatorGame(game: Game, userId: number): void {
    if (userId !== game.creatorId) {
      throw new ForbiddenError(GAMES_ERROR_MESSAGE.NOT_A_CREATOR);
    }
  }

  static getGameForUserByRoleInGame(userId: number, game: Game): GameForCreator | GameForOpponent | Game {
    if (userId === game.creatorId) {
      return this.getClearGameObjectForCreator(game);
    }

    if (userId === game.opponentId) {
      return this.getClearGameObjectForOpponent(game);
    }

    return game;
  }

  static getClearGameObjectForCreator(game: Game): GameForCreator {
    const gameForCreator: any = Object.assign({}, game);

    delete gameForCreator.hiddenByOpponent;

    return gameForCreator as GameForCreator;
  }

  static getClearGameObjectForOpponent(game: Game): GameForOpponent {
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
