import { DeleteResult } from 'typeorm';

import { ForbiddenError, NotFoundError } from '@errors';

import { GameForCreator, GameForOpponent, GAME_STATUS } from './games.constants';
import { GamesRepository } from 'games/games.repository';
import { Game } from './game.entity';
import { Step } from './step.entity';

export class GamesService {
  static async calculateWinner(game: Game, lastSteps: string[]): Promise<Game> {
    if (lastSteps[0] === game.hiddenByOpponent && lastSteps[1] !== game.hiddenByCreator) {
      return GamesRepository.setWinner(game, game.creatorId);
    }

    if (lastSteps[0] !== game.hiddenByOpponent && lastSteps[1] === game.hiddenByCreator) {
      return GamesRepository.setWinner(game, game.opponentId);
    }

    return GamesRepository.setWinner(game);
  }

  static async changeStatus(game: Game, status: GAME_STATUS): Promise<Game> {
    return GamesRepository.changeStatus(game, status);
  }

  static async step(userId: number, game: Game, stepValue: string): Promise<Step> {
    const { bulls, cows } = GamesService.calculateBullsAndCows(userId, game, stepValue);

    let sequence = 1;

    if (game.steps) {
      sequence += game.steps.length;
    }

    const step = GamesRepository.stepCreate(userId, game, sequence, stepValue, bulls, cows);

    return step;
  }

  static async deleteGame(gameId: number): Promise<DeleteResult> {
    return GamesRepository.delete(gameId);
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
  } | void> {
    const games = await GamesRepository.getAllGamesWithParams(userId, userIds, gameStatus);

    if (!games) {
      throw new NotFoundError('Games with this params is not found');
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

  static async changeSettings(game: Game, hiddenLength: number): Promise<Game> {
    return GamesRepository.changeSettings(game, hiddenLength);
  }

  static async hidden(game: Game, userId: number, hidden: string): Promise<Game> {
    return GamesRepository.hidden(game, userId, hidden);
  }

  static async changeOpponent(game: Game, newOpponentId: number): Promise<Game> {
    return GamesRepository.changeOpponent(game, newOpponentId);
  }

  static async findById(id: number): Promise<Game | null> {
    return GamesRepository.findById(id);
  }

  static async createGame(userId: number, opponentId: number): Promise<Game> {
    return GamesRepository.create(userId, opponentId);
  }

  static async findUnfinishedGameForTwoUsers(userId: number, opponentId: number): Promise<Game | null> {
    return GamesRepository.findUnfinishedGameForTwoUsers(userId, opponentId);
  }

  static isMemberGame(game: Game, userId: number): void {
    if (userId !== game.creatorId && userId !== game.opponentId) {
      throw new ForbiddenError('You are not a member of this game');
    }
  }

  static async findByIdOrFail(id: number): Promise<Game> {
    const game = await GamesRepository.findById(id);

    if (!game) {
      throw new NotFoundError('Game not found');
    }

    return game;
  }

  static async findStepsForGame(gameId: number): Promise<Step[] | null> {
    return GamesRepository.stepFindByGame(gameId);
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
