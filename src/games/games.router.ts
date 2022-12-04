import * as express from 'express';
import { Application } from 'express';

import { isAuth, isAdmin, validatePayload } from '@middleware';

import { GamesValidation } from './games.validation';
import { GamesController } from './games.controller';

const router = express.Router();
router.get('/', ...GamesValidation.allMyGame, validatePayload, GamesController.getAllMyGames);
router.post('/', ...GamesValidation.createGame, validatePayload, GamesController.createGame);

router.get('/:gameId', ...GamesValidation.infoAboutGame, validatePayload, GamesController.getInfoAboutGame);
router.patch('/:gameId', ...GamesValidation.changeOpponent, validatePayload, GamesController.changeOpponent);
router.delete('/:gameId', ...GamesValidation.deleteGame, validatePayload, GamesController.deleteGame);

router.post('/:gameId/hidden', ...GamesValidation.hidden, validatePayload, GamesController.makeHidden);
router.post('/:gameId/step', ...GamesValidation.step, validatePayload, GamesController.makeStep);

router.patch(
  '/digits-number/:gameId',
  isAdmin,
  ...GamesValidation.changeSettings,
  validatePayload,
  GamesController.changeSettings
);

export function mountRouter(app: Application): void {
  app.use('/games', isAuth, router);
}
