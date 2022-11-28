import { NextFunction, Request, Response } from 'express';

export class GamesController {
  static allMyGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userIds = req.query.userIds;

      console.log('userIds: ', userIds);

      res.status(200).json('Game[]');
    } catch (error) {
      next(error);
    }
  };

  static createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opponentId = Number(req.body.opponentId);
      const creatorId = Number(req.userId);

      console.log('opponentId: ', opponentId);
      console.log('creatorId: ', creatorId);

      res.status(200).json('Game');
    } catch (error) {
      next(error);
    }
  };

  static infoAboutGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);

      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      res.status(200).json('Game');
    } catch (error) {
      next(error);
    }
  };

  static changeOpponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const newOpponentId = Number(req.body.opponentId);
      const gameId = Number(req.params.gameId);

      console.log('userId: ', userId);
      console.log('newOpponentId: ', newOpponentId);
      console.log('gameId: ', gameId);

      res.status(200).json('Game');
    } catch (error) {
      next(error);
    }
  };

  static deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);

      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      res.status(200).json({ message: 'Game deleted' });
    } catch (error) {
      next(error);
    }
  };

  static hidden = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);

      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      res.status(200).json('Game');
    } catch (error) {
      next(error);
    }
  };

  static step = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);
      const stepValue = String(req.body.stepValue);

      console.log('userId: ', userId);
      console.log('gameId: ', gameId);
      console.log('stepValue: ', stepValue);

      res.status(200).json('Step');
    } catch (error) {
      next(error);
    }
  };

  static changeSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hiddenLength = Number(req.body.hiddenLength);
      const userId = Number(req.userId);
      const gameId = Number(req.params.gameId);

      console.log('hiddenLength: ', hiddenLength);
      console.log('userId: ', userId);
      console.log('gameId: ', gameId);

      res.status(200).json('Game');
    } catch (error) {
      next(error);
    }
  };
}
