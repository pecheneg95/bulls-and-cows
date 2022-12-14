import { Game } from './game.entity';

const DEFAULT_GAMES_OFFSET = 0;
const DEFAULT_GAMES_LIMIT = 20;
const DEFAULT_HIDDEN_LENGTH = 4;

enum GAME_STATUS {
  CREATED = 'created',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

enum GAME_SORT_BY {
  CREATION_DATE = 'creation_date',
}

enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}

type GameForCreator = Omit<Game, 'hiddenByOpponent'>;

type GameForOpponent = Omit<Game, 'hiddenByCreator'>;

export {
  DEFAULT_GAMES_OFFSET,
  DEFAULT_GAMES_LIMIT,
  DEFAULT_HIDDEN_LENGTH,
  GAME_STATUS,
  GAME_SORT_BY,
  SORT_DIRECTION,
  GameForCreator,
  GameForOpponent,
};
