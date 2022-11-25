import * as express from 'express';
import { Application } from 'express';

import { isAuth, validatePayload } from '@middleware';

import { UsersController } from 'users/users.controller';
import { UsersValidation } from 'users/users.validation';

const router = express.Router();

router.get('/me', UsersController.me);
router.get('/:userId/stats', ...UsersValidation.stats, validatePayload, UsersController.stats);
router.get('/leaderboard', ...UsersValidation.leaderboard, validatePayload, UsersController.getLeaderboard); // Поcмотреть leaderboard

export function mountRouter(app: Application): void {
  app.use('/users', isAuth, router);
}
