import { Not } from 'typeorm';
import { Game } from './game.entity';
import { GAME_STATUS } from './games.constants';
//import { GAME_STATUS } from './games.constants';
//import { USER_ROLE } from './users.constants';

class GamesRepository {
  async create(creatorId: number, opponentId: number): Promise<Game> {
    let game = Game.create({
      creatorId,
      opponentId,
    });

    game = await Game.save(game);

    return game;
  }

  async findById(id: number): Promise<Game | null> {
    return await Game.findOneBy({ id });
  }

  async findUnfinishedGameForTwoUsers(firstUserId: number, secondUserId): Promise<Game | null> {
    return await Game.findOne({
      where: [
        { opponentId: firstUserId, creatorId: secondUserId, status: Not(GAME_STATUS.FINISHED) },
        { opponentId: secondUserId, creatorId: firstUserId, status: Not(GAME_STATUS.FINISHED) },
      ],
    });
  }
}
export default new GamesRepository();
