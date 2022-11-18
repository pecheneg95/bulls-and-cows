import { body, param, query } from 'express-validator';

export class GamesValidation {
  static allGame = [
    query('gameId').notEmpty().isInt().custom((value) => value >= 0),
    query('status').isNumeric(),
    query('sort').isNumeric(),
    query('sort').isNumeric(),
    query('offset').isNumeric(),
    query('limit').isNumeric(),
    /*
    gameIds?: number[],
    status?: GAME_STATUS,
    sort[type]?: SORT_DIRECTION,
    sort[field]: GAME_SORT_BY,
    offset: number,
    limit: number,
    */
  ];

  static createGame = [
    body('opponentId').notEmpty().isInt().custom((value) => value >= 0)
  ];

  static deleteGame = [
    param('gameId').notEmpty().isInt().custom((value) => value >= 0)
  ];

  static changeOpponent = [
    param('gameId').notEmpty().isInt().custom((value) => value >= 0)
  ];
}