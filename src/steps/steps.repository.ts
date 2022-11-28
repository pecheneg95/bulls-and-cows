import { Game } from '@games';
import { Step } from '../games/step.entity';
//import { GAME_STATUS } from './games.constants';
//import { USER_ROLE } from './users.constants';

class StepsRepository {
  findByGame(gameId: number): Promise<Step[] | null> {
    return Step.find({ where: { gameId: gameId } });
  }
  async create(
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

  async findById(id: number): Promise<Step | null> {
    return Step.findOneBy({ id });
  }
}

export default new StepsRepository();
