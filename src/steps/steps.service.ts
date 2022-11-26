import { Game } from '@games';
import { Step } from './step.entity';
import stepsRepository from './steps.repository';

export default class StepsService {
  static findStepsForGame(gameId: number): Promise<Step[] | null> {
    return stepsRepository.findByGame(gameId);
  }
  static calculateBullsAndCows(userId: number, game: Game, stepValue: string): { bulls: number; cows: number } {
    const checkHidden = (game.creatorId === userId ? game.hiddenByOpponent : game.hiddenByCreator) as string;
    let bulls = 0;
    let cows = 0;

    stepValue.split('').forEach((el, i) => {
      if (checkHidden.includes(el)) {
        if (i === checkHidden.indexOf(el)) {
          bulls++;
        } else {
          cows++;
        }
      }
    });
    return { bulls, cows };
  }
}
