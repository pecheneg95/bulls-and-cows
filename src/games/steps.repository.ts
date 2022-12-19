import { Step } from './step.entity';

export class StepsRepository {
  static async findByGameId(gameId: number): Promise<Step[] | null> {
    return Step.find({ where: { gameId } });
  }

  static async getLastStepInGame(id: number): Promise<Step | null> {
    return Step.createQueryBuilder('step')
      .select('step')
      .where('step."gameId" = :gameId', { gameId: id })
      .orderBy('step.sequence', 'DESC')
      .getOne();
  }

  static async create(
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
}
