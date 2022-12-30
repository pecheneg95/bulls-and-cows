const DEFAULT_USERS_OFFSET = 0;
const DEFAULT_USERS_LIMIT = 20;
const DEFAULT_USERS_DATE_FROM = new Date('2022/01/01');
const DEFAULT_USERS_DATE_TO = new Date('2050/01/01');

enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

enum STATS {
  GAMES_COUNT = 'gamesCount',
  COMPLETED_GAMES_COUNT = 'completedGamesCount',
  WINS_COUNT = 'winsCount',
  LOSSES_COUNT = 'lossesCount',
  DRAWS_COUNT = 'drawsCount',
  AVERAGE_STEPS_COUNT_TO_WIN = 'averageStepsCountToWin',
}

enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export {
  DEFAULT_USERS_OFFSET,
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_DATE_FROM,
  DEFAULT_USERS_DATE_TO,
  USER_ROLE,
  STATS,
  SORT_DIRECTION,
};
