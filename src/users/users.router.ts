import * as express from 'express';

import { UsersController } from './users.controller';

const router = express.Router();

router.get('/me', ...UsersController.getMe);
