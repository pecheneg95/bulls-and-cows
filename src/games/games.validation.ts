import { body, param, query } from 'express-validator';
import { GAME_SORT_BY, GAME_STATUS, SORT_DIRECTION } from './games.constants';

export class GamesValidation {
  static allMyGame = [
    query('userIds')
      .optional()
      .custom((value) => {
        if (!Array.isArray(value)) {
          return value.trim().length > 0;
        } else {
          return value.every((el: string) => el.trim().length > 0);
        }
      })
      .withMessage('Value is empty')
      .custom((value) => {
        if (!Array.isArray(value)) {
          return typeof Number(value) === 'number' && !Number.isNaN(Number(value));
        } else {
          return value.every((el: string) => typeof Number(el) === 'number' && !Number.isNaN(Number(el)));
        }
      })
      .withMessage('Value is not number'),
    query('status')
      .optional()
      .custom((value) => Object.values(GAME_STATUS).includes(value))
      .withMessage('Value is not includes enum GAME_STATUS'),
    query('sort[field]')
      .optional()
      .custom((value) => Object.values(GAME_SORT_BY).includes(value))
      .withMessage('Value is not includes enum GAME_SORT_BY'),
    query('sort[type]')
      .optional()
      .custom((value) => Object.values(SORT_DIRECTION).includes(value))
      .withMessage('Value is not includes enum SORT_DIRECTION'),
    query('offset')
      .optional()
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
    query('limit')
      .optional()
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
  ];

  static createGame = [
    body('opponentId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
  ];

  static deleteGame = [
    param('gameId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
  ];

  static changeOpponent = [
    param('gameId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
    body('opponentId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
  ];

  static infoAboutGame = [
    param('gameId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
  ];

  static hidden = [
    param('gameId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
    body('hidden')
      .isString()
      .trim()
      .custom((value) => value.length === new Set(value.split('')).size)
      .withMessage('Value includes not unique symbol')
      .custom((value) => value >= 4)
      .withMessage('Value less than 4'),
  ];

  static step = [
    param('gameId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
    body('stepValue')
      .isString()
      .trim()
      .custom((value) => value.length === new Set(value.split('')).size)
      .withMessage('Value includes not unique symbol')
      .custom((value) => value >= 4)
      .withMessage('Value less than 4'),
  ];

  static changeSettings = [
    param('gameId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
    body('hiddenLength')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 4)
      .withMessage('Value less than 4'),
  ];
}
