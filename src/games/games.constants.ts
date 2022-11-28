enum GAME_STATUS {
  CREATED = 'created',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

enum GAME_SORT_BY {
  CREATION_DATE = 'сreation_date',
}

enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

const MIN_HIDDEN_LENGTG = 4;

export { GAME_STATUS, GAME_SORT_BY, SORT_DIRECTION, MIN_HIDDEN_LENGTG };
