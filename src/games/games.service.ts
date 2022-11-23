//import { AppError } from '@errors';
import gamesRepository from 'games/games.repository';
import { Game } from './game.entity';

export class GamesService {
  static async createGame(userId: number, opponentId: number): Promise<Game> {
    return gamesRepository.create(userId, opponentId);
  }

  static async findUnfinishedGameForTwoUsers(userId: number, opponentId: number): Promise<Game | Game[] | null> {
    return await gamesRepository.findUnfinishedGameForTwoUsers(userId, opponentId);
  }
}
