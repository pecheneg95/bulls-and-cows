import { NextFunction, Request, Response } from 'express';
import {  GAME_SORT_BY, GAME_STATUS, SORT_DIRECTION } from './games.constants';

export class GamesController {
  static getAllMyGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static infoAboutGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static changeOpponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static hidden = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static step = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };

  static changeSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log()
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  };
}
