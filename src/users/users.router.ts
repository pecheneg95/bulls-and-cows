import * as express from 'express';
import { Application } from 'express';

import { isAuth, validatePayload } from '@middleware';

import { GetLeaderboardRequest, GetUserStatsRequest } from './users.types';
import { UsersValidation } from './users.validation';
import { UsersSanitizer } from './users.sanitizer';
import { UsersController } from './users.controller';

const router = express.Router();

router.get('/me', isAuth, UsersController.getInfoAboutMyself);

router.get(
  '/:userId/stats',
  ...UsersValidation.stats,
  validatePayload<GetUserStatsRequest>,
  UsersSanitizer.getUserStats,
  UsersController.getUserStats
);

router.get(
  '/leaderboard',
  ...UsersValidation.leaderboard,
  validatePayload<GetLeaderboardRequest>,
  UsersController.getLeaderboard
);

export function mountRouter(app: Application): void {
  app.use('/users', router);
}
