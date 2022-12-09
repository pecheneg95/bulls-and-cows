import { Between, Brackets, DeleteResult, Not } from 'typeorm';

import { GAME_STATUS, SORT_DIRECTION } from './games.constants';
import { Game } from './game.entity';
import { Step } from './step.entity';

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

  static async setWinner(game: Game, winnerId?: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    if (winnerId) {
      updatedGame.winnerId = winnerId;

      await Game.save(updatedGame);

      return updatedGame;
    }

    return updatedGame;
  }

  static async getAllGamesWithParams(
    userId: number,
    userIds: number[] | null = null,
    gameStatus: GAME_STATUS | null = null,
    sortType: SORT_DIRECTION | null,
    offset = 0,
    limit = 20
  ): Promise<[Game[], number] | null> {
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

    if (sortType === SORT_DIRECTION.DESC) {
      query.orderBy('game."createdAt"', 'DESC');
    } else {
      query.orderBy('game."createdAt"', 'ASC');
    }

    query.offset(offset).limit(limit);

    return query.getManyAndCount();
  }

  static async stepFindByGameId(gameId: number): Promise<Step[] | null> {
    return Step.find({ where: { gameId: gameId } });
  }

  static async getLastStepInGame(id: number): Promise<Step | null> {
    return Step.createQueryBuilder('step')
      .select('step')
      .where('step."gameId" = :gameId', { gameId: id })
      .orderBy('step.sequence', 'DESC')
      .limit(1)
      .getOne();
  }

  static async stepCreate(
    userId: number,
    game: Game,
    sequence: number,
    value: string,
    bulls: number,
    cows: number
  ): Promise<Step> {
    let step = Step.create({
      userId,
      gameId: game.id,
      sequence,
      value,
      bulls,
      cows,
    });

    step = await Step.save(step);

    return step;
  }
}
