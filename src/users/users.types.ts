import { Request } from 'express';

import { STATS } from './users.constants';

type getUserStatsRequestParamsDTO = {
  userId: string | number;
};

type getUserStatsSanitizedRequestParamsDTO = {
  userId: number;
};

export type GetUserStatsRequest = Request<getUserStatsRequestParamsDTO, unknown, unknown, unknown>;
export type GetUserStatsSanitizedRequest = Request<getUserStatsSanitizedRequestParamsDTO, unknown, unknown, unknown>;

type getLeaderboardRequestQueryDTO = {
  sort: string | STATS;
  from?: string | Date;
  to?: string | Date;
  offset?: string | number;
  limit?: string | number;
};

type getLeaderboardSanitizedRequestQueryDTO = {
  sort: STATS;
  from: Date;
  to: Date;
  offset: number;
  limit: number;
};

export type GetLeaderboardRequest = Request<unknown, unknown, unknown, getLeaderboardRequestQueryDTO>;
export type GetLeaderboardSanitizedRequest = Request<unknown, unknown, unknown, getLeaderboardSanitizedRequestQueryDTO>;

export type UserStats = {
  userId: number;
  username: string;
  [STATS.GAMES_COUNT]: string | number;
  [STATS.COMPLETED_GAMES_COUNT]: string | number;
  [STATS.WINS_COUNT]: string | number;
  [STATS.LOSSES_COUNT]: string | number;
  [STATS.DRAWS_COUNT]: string | number;
  [STATS.AVERAGE_STEPS_COUNT_TO_WIN]: string | number;
};

export type UserStatsSanitize = {
  userId: number;
  username: string;
  [STATS.GAMES_COUNT]: number;
  [STATS.COMPLETED_GAMES_COUNT]: number;
  [STATS.WINS_COUNT]: number;
  [STATS.LOSSES_COUNT]: number;
  [STATS.DRAWS_COUNT]: number;
  [STATS.AVERAGE_STEPS_COUNT_TO_WIN]: number;
};

export type LeaderboardWithTotalCount = {
  totalCount: number;
  leaderboard: UserStats[];
};
