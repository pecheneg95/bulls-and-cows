import * as express from 'express';
import { Application } from 'express';

import { isAuth, checkRole, validatePayload } from '@middleware';

import { USER_ROLE } from '@users';

import {
  ChangeOpponentRequest,
  ChangeSettingsRequest,
  CreateGameRequest,
  DeleteGameRequest,
  GetAllMyGamesRequest,
  GetGameRequest,
  MakeStepRequest,
  SetHiddenRequest,
} from './games.types';
import { GamesValidation } from './games.validation';
import { GamesSanitizer } from './games.sanitizer';
import { GamesController } from './games.controller';

const router = express.Router();

router.get(
  '/',
  ...GamesValidation.allMyGame,
  validatePayload<GetAllMyGamesRequest>,
  GamesSanitizer.getAllMyGames,
  GamesController.getAllMyGames
);

router.post(
  '/',
  ...GamesValidation.createGame,
  validatePayload<CreateGameRequest>,
  GamesSanitizer.createGame,
  GamesController.createGame
);

router.get('/:gameId', ...GamesValidation.infoAboutGame, validatePayload<GetGameRequest>, GamesController.getGame);

router.patch(
  '/:gameId',
  ...GamesValidation.changeOpponent,
  validatePayload<ChangeOpponentRequest>,
  GamesController.changeOpponent
);

router.delete(
  '/:gameId',
  ...GamesValidation.deleteGame,
  validatePayload<DeleteGameRequest>,
  GamesController.deleteGame
);

router.post('/:gameId/hidden', ...GamesValidation.hidden, validatePayload<SetHiddenRequest>, GamesController.setHidden);

router.post('/:gameId/step', ...GamesValidation.step, validatePayload<MakeStepRequest>, GamesController.makeStep);

router.patch(
  '/digits-number/:gameId',
  checkRole(USER_ROLE.ADMIN)<ChangeSettingsRequest>,
  ...GamesValidation.changeSettings,
  validatePayload<ChangeSettingsRequest>,
  GamesController.changeSettings
);

export function mountRouter(app: Application): void {
  app.use('/games', isAuth, router);
}
