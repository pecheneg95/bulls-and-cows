import * as express from 'express';
import { Application } from 'express';

import { UsersController } from './users.controller';
import { UsersValidation } from './users.validation';

const router = express.Router();

router.get('/me', UsersController.meGet);
router.get('/:userId/stats', ...UsersValidation.me, UsersController.statsGet);

export function mountRouter(app: Application): void {
  app.use('/users', router);
}
