import { query } from 'express-validator';
import { LEADERBOARD_SORT_BY, SORT_DIRECTION } from './leaderboard.constants';

export class LeaderboardValidation {
  static leaderboard = [
    query('sort[field]')
      .optional()
      .custom((value) => Object.values(LEADERBOARD_SORT_BY).includes(value))
      .withMessage('Value is not includes enum LEADERBOARD_SORT_BY'),
    query('sort[type]')
      .optional()
      .custom((value) => Object.values(SORT_DIRECTION).includes(value))
      .withMessage('Value is not includes enum SORT_DIRECTION'),
    query('from').optional().isDate().withMessage("Value is not Date in format: 'YYYY/MM/DD'"),
    query('to').optional().isDate().withMessage("Value is not Date in format: 'YYYY/MM/DD'"),
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
}
