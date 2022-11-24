//import { AppError } from '@errors';
import { AppError } from '@errors';
import GamesRepository from 'games/games.repository';
import { GameForCreator, GameForOpponent } from 'types/game.types';
import { Game } from './game.entity';
import { GAME_STATUS } from './games.constants';

export class GamesService {
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
