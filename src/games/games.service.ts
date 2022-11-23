//import { AppError } from '@errors';
import gamesRepository from 'games/games.repository';
import { Game } from './game.entity';

export class GamesService {
  static async findById(id: number): Promise<Game | null> {
    return await gamesRepository.findById(id);
  }
  static async createGame(userId: number, opponentId: number): Promise<Game> {
    return await gamesRepository.create(userId, opponentId);
  }

  static async findUnfinishedGameForTwoUsers(userId: number, opponentId: number): Promise<Game | Game[] | null> {
    return await gamesRepository.findUnfinishedGameForTwoUsers(userId, opponentId);
  }
  static async isMember(gameId: number, userId: number): Promise<boolean> {
    const isCreator = await this.isCreator(gameId, userId);
    const isOpponent = await this.isOpponent(gameId, userId);

    if (isCreator || isOpponent) return true;
    return false;
  }
  static async isCreator(gameId: number, userId: number): Promise<boolean> {
    const game = await gamesRepository.findById(gameId);
    if (game?.creatorId === userId) return true;
    return false;
  }
  static async isOpponent(gameId: number, userId: number): Promise<boolean> {
    const game = await gamesRepository.findById(gameId);
    if (game?.opponentId === userId) return true;
    return false;
  }
}
