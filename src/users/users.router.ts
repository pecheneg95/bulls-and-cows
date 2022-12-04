import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '@middleware';

import { UsersController } from 'users/users.controller';
import { UsersValidation } from 'users/users.validation';

const router = express.Router();

router.get('/me', UsersController.getInfoAboutMyself);
router.get('/:userId/stats', ...UsersValidation.stats, validatePayload, UsersController.getUserStats);
router.get('/leaderboard', ...UsersValidation.leaderboard, validatePayload, UsersController.getLeaderboard);

export function mountRouter(app: Application): void {
  app.use('/users', router);
}
