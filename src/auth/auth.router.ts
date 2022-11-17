
import * as express from 'express';
import { Application } from 'express';

import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post('/sign-up', ...AuthValidation.signup, AuthController.signUpPOST);
router.post('/login', ...AuthValidation.login, AuthController.loginPOST);
router.post('/logout', AuthController.logoutPOST);

export function mountRouter(app: Application): void {
  app.use('/auth', router);
}
