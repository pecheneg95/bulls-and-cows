import { body, param, query } from 'express-validator';
import { Game } from './games.repository';

export class GamesValidation {
  static allMyGame = [
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
    param('gameId').notEmpty().isInt().custom((value) => value >= 0),
    body('opponentId').notEmpty().isInt().custom((value) => value >= 0)
  ];

  static infoAboutGame = [
    param('gameId').notEmpty().isInt().custom((value) => value >= 0)
  ];

  static getHiddenLength = () => Game.hiddenLength;

  static hidden = [
    param('gameId').notEmpty().isInt().custom((value) => value >= 0),
    body('hidden').notEmpty().isString().trim().custom((value) => value.length === new Set(value.split('')).size).isLength({ min: GamesValidation.getHiddenLength(), max: GamesValidation.getHiddenLength(), })
  ];
}