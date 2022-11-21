import { Game } from './game.entity';
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
    return Game.findOneBy({ id });
  }
}

export default new GamesRepository();
