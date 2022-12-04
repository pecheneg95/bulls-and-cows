import { Between, DeleteResult, In, Not } from 'typeorm';

import { GAME_STATUS } from './games.constants';
import { Game } from './game.entity';
import { Step } from './step.entity';

export class GamesRepository {
  static async setWinner(game: Game, winnerId?: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    if (winnerId) {
      updatedGame.winnerId = winnerId;

      await Game.save(updatedGame);

      return updatedGame;
    }

    return updatedGame;
  }

  static async changeStatus(game: Game, status: GAME_STATUS): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.status = status;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async delete(gameId: number): Promise<DeleteResult> {
    return Game.delete({ id: gameId });
  }

  static async getAllGamesWithParams(
    userId: number,
    userIds: number[] | null = null,
    gameStatus: GAME_STATUS | null = null
  ): Promise<Game[] | null> {
    if (userIds && gameStatus) {
      return Game.find({
        where: [
          { creatorId: userId, opponentId: In(userIds), status: gameStatus },
          { creatorId: In(userIds), opponentId: userId, status: gameStatus },
        ],
      });
    }

    if (userIds && !gameStatus) {
      return Game.find({
        where: [
          { creatorId: userId, opponentId: In(userIds) },
          { creatorId: In(userIds), opponentId: userId },
        ],
      });
    }

    if (!userIds && gameStatus) {
      return Game.find({
        where: [
          { creatorId: userId, status: gameStatus },
          { opponentId: userId, status: gameStatus },
        ],
      });
    }

    return Game.find({
      where: [{ creatorId: userId }, { opponentId: userId }],
    });
  }

  static async changeSettings(game: Game, hiddenLength: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.hiddenLength = hiddenLength;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async hidden(game: Game, userId: number, hidden: string): Promise<Game> {
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

  static async changeOpponent(game: Game, newOpponentId: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);

    updatedGame.opponentId = newOpponentId;

    await Game.save(updatedGame);

    return updatedGame;
  }

  static async create(creatorId: number, opponentId: number): Promise<Game> {
    let game = Game.create({
      creatorId,
      opponentId,
    });

    game = await Game.save(game);

    return game;
  }

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

  static async stepFindByGame(gameId: number): Promise<Step[] | null> {
    return Step.find({ where: { gameId: gameId } });
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

  static async stepFindById(id: number): Promise<Step | null> {
    return Step.findOneBy({ id });
  }
}
