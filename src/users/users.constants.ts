enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

enum STATS {
  GAMES_COUNT = 'gamesCount',
  COMPLETED_GAMES_COUNT = 'completedGamesCount',
  WINS_COUNT = 'winsCount',
  LOSSES_COUNT = 'lossesCount',
  DRAW_COUNT = 'drawCount',
  AVERAGE_STEPS_COUNT_TO_WIN = 'averageStepsCountToWin',
}

enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

type Stats = {
  userId: number;
  username: string;
  [STATS.GAMES_COUNT]: number;
  [STATS.COMPLETED_GAMES_COUNT]: number;
  [STATS.WINS_COUNT]: number;
  [STATS.LOSSES_COUNT]: number;
  [STATS.DRAW_COUNT]: number;
  [STATS.AVERAGE_STEPS_COUNT_TO_WIN]: number;
};

export { USER_ROLE, STATS, SORT_DIRECTION, Stats };
