import { STATS } from '@users';

export type Stats = {
  userid: number;
  username: string;
  [STATS.GAMES_COUNT]: number;
  [STATS.WINS_COUNT]: number;
  [STATS.LOSSES_COUNT]: number;
  [STATS.DRAW_COUNT]: number;
  [STATS.COMPLETED_GAMES_COUNT]: number;
  [STATS.AVERAGE_STEPS_COUNT_TO_WIN]: number;
};
