import * as express from 'express';
import { Application } from 'express';

import { isAuth, checkRole, validatePayload } from '@middleware';

import { GamesValidation } from './games.validation';
import { GamesController } from './games.controller';
import { USER_ROLE } from '@users';

const router = express.Router();
router.get('/', ...GamesValidation.allMyGame, validatePayload, GamesController.getAllMyGames);
router.post('/', ...GamesValidation.createGame, validatePayload, GamesController.createGame);

router.get('/:gameId', ...GamesValidation.infoAboutGame, validatePayload, GamesController.getGame);
router.patch('/:gameId', ...GamesValidation.changeOpponent, validatePayload, GamesController.changeOpponent);
router.delete('/:gameId', ...GamesValidation.deleteGame, validatePayload, GamesController.deleteGame);

router.post('/:gameId/hidden', ...GamesValidation.hidden, validatePayload, GamesController.setHidden);
router.post('/:gameId/step', ...GamesValidation.step, validatePayload, GamesController.makeStep);

router.patch(
  '/digits-number/:gameId',
  checkRole(USER_ROLE.ADMIN),
  ...GamesValidation.changeSettings,
  validatePayload,
  GamesController.changeSettings
);

export function mountRouter(app: Application): void {
  app.use('/games', isAuth, router);
}
