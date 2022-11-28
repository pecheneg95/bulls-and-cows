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

export { USER_ROLE, STATS, SORT_DIRECTION };
