import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '../middleware/validate-payload.middleware';

import { UsersController } from './users.controller';
import { UsersValidation } from './users.validation';

const router = express.Router();

router.get('/me', UsersController.me);
router.get('/:userId/stats', ...UsersValidation.stats, validatePayload, UsersController.stats);

export function mountRouter(app: Application): void {
  app.use('/users', router);
}
