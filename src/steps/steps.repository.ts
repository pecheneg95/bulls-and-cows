import { Step } from './step.entity';
//import { GAME_STATUS } from './games.constants';
//import { USER_ROLE } from './users.constants';

class StepsRepository {
  async create(
    userId: number,
    gameId: number,
    sequence: number,
    value: string,
    bulls: number,
    cows: number
  ): Promise<Step> {
    let step = Step.create({
      userId,
      gameId,
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
