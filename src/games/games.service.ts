import { AppError } from '@errors';
import { Step } from '@steps';
import { User } from '@users';
import GamesRepository from 'games/games.repository';
import { DeleteResult } from 'typeorm';
import { GameForCreator, GameForOpponent } from 'types/game.types';
import { Stats } from 'types/user.types';
import { Game } from './game.entity';
import { GAME_STATUS } from './games.constants';
import stepsRepository from 'steps/steps.repository';
import stepsService from 'steps/steps.service';

export class GamesService {
  static calculateWinner(game: Game, lastSteps: string[]): Promise<Game> {
    if (lastSteps[0] === game.hiddenByOpponent && lastSteps[1] !== game.hiddenByCreator) {
      return GamesRepository.setWinner(game, game.creatorId);
    }

    if (lastSteps[0] !== game.hiddenByOpponent && lastSteps[1] === game.hiddenByCreator) {
      return GamesRepository.setWinner(game, game.opponentId);
    }

    return GamesRepository.setWinner(game);
  }

  static changeStatus(game: Game, status: GAME_STATUS): PromiseLike<Game> {
    return GamesRepository.changeStatus(game, status);
  }

  static step(userId: number, game: Game, stepValue: string): Promise<Step> {
    const { bulls, cows } = stepsService.calculateBullsAndCows(userId, game, stepValue);
    console.log(game.steps);
    let sequence: number;
    if (game.steps) {
      sequence = game.steps.length + 1;
    } else {
      sequence = 1;
    }

    const step = stepsRepository.create(userId, game, sequence, stepValue, bulls, cows);

    return step;
  }

  static async deleteGame(gameId: number): Promise<DeleteResult> {
    return GamesRepository.delete(gameId);
  }
  static async calculateUserStatistics(user: User, from?: Date, to?: Date): Promise<Stats> {
    const userGames = await GamesService.getAllGamesForUser(user.id, from, to);
    let stats: Stats = {
      userid: 0,
      username: '',
      gamesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      drawCount: 0,
      completedGamesCount: 0,
      averageStepsCountToWin: 0,
    };
    if (!userGames) {
      stats = {
        userid: user.id,
        username: user.username,
        gamesCount: 0,
        winsCount: 0,
        lossesCount: 0,
        drawCount: 0,
        completedGamesCount: 0,
        averageStepsCountToWin: 0,
      };
      return stats;
    }

    const winsGames = userGames.filter((el) => el.status === GAME_STATUS.FINISHED && el.winnerId === user.id);
    const winsCount = winsGames.length;
    const lossesCount = userGames.filter(
      (el) => el.status === GAME_STATUS.FINISHED && el.winnerId !== user.id && el.winnerId !== null
    ).length;
    const drawCount = userGames.filter((el) => el.status === GAME_STATUS.FINISHED && el.winnerId === null).length;
    const completedGamesCount = userGames.filter((el) => el.status === GAME_STATUS.FINISHED).length;
    /* const averageStepsCountToWin =
      winsGames.reduce((el) => el.steps.filter((el) => el.userId === userId).length) / winsGames.length;*/
    stats = {
      userid: user.id,
      username: user.username,
      gamesCount: userGames.length,
      winsCount: winsCount,
      lossesCount: lossesCount,
      drawCount: drawCount,
      completedGamesCount: completedGamesCount,
      averageStepsCountToWin: 0,
    };

    return stats;
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
      AppError.notFound('Games with this params is not found');
    } else {
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
      AppError.forbidden('You are not a member of this game');
    }
  }

  static async findByIdOrFail(id: number): Promise<Game> {
    const game = await GamesRepository.findById(id);
    if (!game) {
      AppError.notFound('Game not found');
    }
    return game as Game;
  }

  static getClearGameObjectForCreator(game: Game): GameForCreator {
    const gameForCreator: any = Object.assign({}, game);
    delete gameForCreator.hiddenByOpponent;
    return gameForCreator as GameForCreator;
  }

  static getClearGameObjectForOpponent = (game: Game): GameForOpponent => {
    const gameForOpponent: any = Object.assign({}, game);
    delete gameForOpponent.hiddenByCreator;
    return gameForOpponent as GameForOpponent;
  };
}
