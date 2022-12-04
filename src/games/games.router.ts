import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '@middleware';

import { GamesController } from './games.controller';
import { GamesValidation } from './games.validation';

const router = express.Router();

router.get('/', ...GamesValidation.allMyGame, validatePayload, GamesController.getAllMyGames);
router.post('/', ...GamesValidation.createGame, validatePayload, GamesController.createGame);

router.get('/:gameId', ...GamesValidation.infoAboutGame, validatePayload, GamesController.getInfoAboutGame);
router.patch('/:gameId', ...GamesValidation.changeOpponent, validatePayload, GamesController.changeOpponent);
router.delete('/:gameId', ...GamesValidation.deleteGame, validatePayload, GamesController.deleteGame);

router.post('/:gameId/hidden', ...GamesValidation.hidden, validatePayload, GamesController.makeHidden);
router.post('/:gameId/step', ...GamesValidation.step, validatePayload, GamesController.makeMove);

router.patch(
  'digits-number/:gameId',
  ...GamesValidation.changeSettings,
  validatePayload,
  GamesController.changeSettings
);

export function mountRouter(app: Application): void {
  app.use('/games', router);
}
