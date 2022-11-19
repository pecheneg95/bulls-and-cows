import * as express from 'express';
import { Application } from 'express';

import { validatePayload } from '../middleware/validate-payload.middleware';

import { GamesController } from './games.controller';
import { GamesValidation } from './games.validation';

const router = express.Router();

router.get('/', ...GamesValidation.allMyGame, validatePayload, GamesController.getAllMyGames); // Получить информацию о всех своих играх (с филльтрацией)
router.post('/', ...GamesValidation.createGame, validatePayload, GamesController.createGame); // Создать игру

router.get('/:gameId', ...GamesValidation.infoAboutGame, validatePayload, GamesController.infoAboutGame); // Получить информацию об игре
router.patch('/:gameId', ...GamesValidation.changeOpponent, validatePayload, GamesController.changeOpponent); // Изменить противника
router.delete('/:gameId', ...GamesValidation.deleteGame, validatePayload, GamesController.deleteGame); // Отменить игру (удалить)

router.post('/:gameId/hidden', ...GamesValidation.hidden, validatePayload, GamesController.hidden); // Загадать число
router.post('/:gameId/step', ...GamesValidation.step, validatePayload, GamesController.step); // Сделать ход

router.patch(
  'digits-number/:gameId',
  ...GamesValidation.changeSettings,
  validatePayload,
  GamesController.changeSettings
); // Изменить настройки игры (для admin)

export function mountRouter(app: Application): void {
  app.use('/games', router);
}
