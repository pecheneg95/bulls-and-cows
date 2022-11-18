import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '../middleware/validate-payload.middleware';

import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardValidation } from './leaderboard.validation';

const router = express.Router();

router.get('/', ...LeaderboardValidation.leaderboard, validatePayload, LeaderboardController.getLeaderboard); // Поcмотреть leaderboard

export function mountRouter(app: Application): void {
  app.use('/leaderboard', router);
}