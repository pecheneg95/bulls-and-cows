enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

enum STATS {
  GAMES_COUNT = 'gamesCount',
  WINS_COUNT = 'winsCount',
  LOSSES_COUNT = 'lossesCount',
  DRAW_COUNT = 'drawCount',
  COMPLETED_GAMES_COUNT = 'completedGamesCount',
  AVERAGE_STEPS_COUNT_TO_WIN = 'averageStepsCountToWin',
}

enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

type Stats = {
  userid: number;
  username: string;
  [STATS.GAMES_COUNT]: number;
  [STATS.WINS_COUNT]: number;
  [STATS.LOSSES_COUNT]: number;
  [STATS.DRAW_COUNT]: number;
  [STATS.COMPLETED_GAMES_COUNT]: number;
  [STATS.AVERAGE_STEPS_COUNT_TO_WIN]: number;
};

export { USER_ROLE, STATS, SORT_DIRECTION, Stats };
