import { Between, DeleteResult, In, Not } from 'typeorm';
import { Game } from './game.entity';
import { GAME_STATUS } from './games.constants';

class GamesRepository {
  async setWinner(game: Game, winnerId?: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);
    if (winnerId) {
      updatedGame.winnerId = winnerId;
      await Game.save(updatedGame);
      return updatedGame;
    }
    return updatedGame;
  }
  async changeStatus(game: Game, status: GAME_STATUS): Promise<Game> {
    const updatedGame = Object.assign({}, game);
    updatedGame.status = status;
    await Game.save(updatedGame);
    return updatedGame;
  }
  delete(gameId: number): Promise<DeleteResult> {
    return Game.delete({ id: gameId });
  }
  async getAllGamesWithParams(
    userId: number,
    userIds: number[] | null = null,
    gameStatus: GAME_STATUS | null = null
  ): Promise<Game[] | null> {
    if (userIds) {
      if (gameStatus) {
        return Game.find({
          where: [
            { creatorId: userId, opponentId: In(userIds), status: gameStatus },
            { creatorId: In(userIds), opponentId: userId, status: gameStatus },
          ],
        });
      } else {
        return Game.find({
          where: [
            { creatorId: userId, opponentId: In(userIds) },
            { creatorId: In(userIds), opponentId: userId },
          ],
        });
      }
    }
    if (gameStatus) {
      return Game.find({
        where: [
          { creatorId: userId, status: gameStatus },
          { opponentId: userId, status: gameStatus },
        ],
      });
    } else {
      return Game.find({
        where: [{ creatorId: userId }, { opponentId: userId }],
      });
    }
  }

  async changeSettings(game: Game, hiddenLength: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);
    updatedGame.hiddenLength = hiddenLength;

    await Game.save(updatedGame);
    return updatedGame;
  }

  async hidden(game: Game, userId: number, hidden: string): Promise<Game> {
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

  async changeOpponent(game: Game, newOpponentId: number): Promise<Game> {
    const updatedGame = Object.assign({}, game);
    updatedGame.opponentId = newOpponentId;
    await Game.save(updatedGame);
    return updatedGame;
  }

  async create(creatorId: number, opponentId: number): Promise<Game> {
    let game = Game.create({
      creatorId,
      opponentId,
    });

    game = await Game.save(game);

    return game;
  }

  async findById(id: number): Promise<Game | null> {
    return Game.findOneBy({ id });
  }
  async findByUserId(userId: number): Promise<Game[] | null> {
    return Game.find({ where: [{ creatorId: userId }, { opponentId: userId }] });
  }
  async findByUserIdWithDate(userId: number, from: Date, to: Date): Promise<Game[] | null> {
    return Game.find({
      where: [
        { creatorId: userId, createdAt: Between(from, to) },
        { opponentId: userId, createdAt: Between(from, to) },
      ],
    });
  }

  async findUnfinishedGameForTwoUsers(firstUserId: number, secondUserId: number): Promise<Game | null> {
    return Game.findOne({
      where: [
        { opponentId: firstUserId, creatorId: secondUserId, status: Not(GAME_STATUS.FINISHED) },
        { opponentId: secondUserId, creatorId: firstUserId, status: Not(GAME_STATUS.FINISHED) },
      ],
    });
  }
}
export default new GamesRepository();
