import { Between, Brackets, DeleteResult, Not } from 'typeorm';

import { GAME_STATUS, SORT_DIRECTION } from './games.constants';
import { Game } from './game.entity';

export class GamesRepository {
  static async findById(id: number): Promise<Game | null> {
    return Game.findOneBy({ id });
  }

  static async findByUserId(userId: number): Promise<Game[] | null> {
    return Game.find({ where: [{ creatorId: userId }, { opponentId: userId }] });
  }

  static async findByUserIdWithDate(userId: number, from: Date, to: Date): Promise<Game[] | null> {
    return Game.find({
      where: [
        { creatorId: userId, createdAt: Between(from, to) },
        { opponentId: userId, createdAt: Between(from, to) },
      ],
    });
  }

  static async findUnfinishedGameForTwoUsers(firstUserId: number, secondUserId: number): Promise<Game | null> {
    return Game.findOne({
      where: [
        { opponentId: firstUserId, creatorId: secondUserId, status: Not(GAME_STATUS.FINISHED) },
        { opponentId: secondUserId, creatorId: firstUserId, status: Not(GAME_STATUS.FINISHED) },
      ],
    });
  }

  static async create(creatorId: number, opponentId: number): Promise<Game> {
    let game = Game.create({
      creatorId,
      opponentId,
    });

    game = await Game.save(game);

    return game;
  }

  static async delete(gameId: number): Promise<DeleteResult> {
    return Game.delete({ id: gameId });
  }

  static async setHidden(game: Game, userId: number, hidden: string): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    if (userId === game.creatorId) {
      updatedGame.hiddenByCreator = hidden;
    }

    if (userId === game.opponentId) {
      updatedGame.hiddenByOpponent = hidden;
    }

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async changeSettings(game: Game, hiddenLength: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.hiddenLength = hiddenLength;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async changeOpponent(game: Game, newOpponentId: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.opponentId = newOpponentId;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async changeStatus(game: Game, status: GAME_STATUS): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.status = status;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async setWinner(game: Game, winnerId: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.winnerId = winnerId;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async getAllGamesWithParams(
    userId: number,
    offset: number,
    limit: number,
    userIds?: number[],
    gameStatus?: GAME_STATUS,
    sortDirection?: SORT_DIRECTION
  ): Promise<[Game[], number]> {
    const query = Game.createQueryBuilder('game')
      .select('game')
      .where(
        new Brackets((qb) => {
          qb.where('game.creatorId = :id', { id: userId }).orWhere('game.opponentId = :id', { id: userId });
        })
      );

    if (userIds) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('game."creatorId" IN (:...ids)', { ids: userIds }).orWhere('game."opponentId" IN (:...ids)', {
            ids: userIds,
          });
        })
      );
    }

    if (gameStatus) {
      query.andWhere('game.status = :status', { status: gameStatus });
    }

    query.orderBy('game."createdAt"', sortDirection as 'ASC' | 'DESC');

    query.offset(offset).limit(limit);

    return query.getManyAndCount();
  }
}
