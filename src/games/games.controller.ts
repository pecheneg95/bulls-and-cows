import { NextFunction, Request, Response } from 'express';
import { GAME_SORT_BY, GAME_STATUS, SORT_DIRECTION } from './games.constants';
import { Game, Games, NewGame } from './games.repository';

export class GamesController {
  static getAllMyGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Get all me games")

      res.status(200).json("Get all me games");
    } catch (error) {
      next(error);
    }
  };

  static createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opponentId = req.body.opponentId

      console.log("opponentId: ", opponentId)

      res.status(200).json(opponentId);
    } catch (error) {
      next(error);
    }
  };

  static infoAboutGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameId = req.params.gameId

      console.log("gameId: ", gameId)

      res.status(200).json(gameId);
    } catch (error) {
      next(error);
    }
  };

  static changeOpponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newOpponentId = req.body.opponentId

      console.log("opponentId: ", newOpponentId)

      res.status(200).json(newOpponentId);
    } catch (error) {
      next(error);
    }
  };

  static deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Game deleted")
      res.status(200).json("Game deleted");
    } catch (error) {
      next(error);
    }
  };

  static hidden = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hidden = req.body.hidden;

      console.log("hidden: ", hidden)

      res.status(200).json(hidden);
    } catch (error) {
      next(error);
    }
  };

  static step = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stepValue = req.body.stepValue;

      console.log("stepValue: ", stepValue)

      res.status(200).json({
        step: stepValue,
        gameStatus: GAME_STATUS.PLAYING
      });
    } catch (error) {
      next(error);
    }
  };

  static changeSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const hiddenLength = req.body.hiddenLength;

      console.log("hiddenLength: ", hiddenLength)

      res.status(200).json(hiddenLength);
    } catch (error) {
      next(error);
    }
  };
}
