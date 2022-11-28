import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '@middleware';

import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/sign-up', ...AuthValidation.signup, validatePayload, AuthController.signUp);
router.post('/login', ...AuthValidation.login, validatePayload, AuthController.login);
router.post('/logout', AuthController.logout);

export function mountRouter(app: Application): void {
  app.use('/auth', router);
}
