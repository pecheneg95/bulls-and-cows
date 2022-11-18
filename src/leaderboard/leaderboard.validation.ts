import { body, param, query } from 'express-validator';

export class LeaderboardValidation {
  static leaderboard = [
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
}