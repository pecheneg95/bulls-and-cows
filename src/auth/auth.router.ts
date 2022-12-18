import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '@middleware';

import { LoginRequest, SignUpRequest } from './auth.types';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/sign-up', ...AuthValidation.signup, validatePayload<SignUpRequest>, AuthController.signUp);

router.post('/login', ...AuthValidation.login, validatePayload<LoginRequest>, AuthController.login);

router.post('/logout', AuthController.logout);

export function mountRouter(app: Application): void {
  app.use('/auth', router);
}
