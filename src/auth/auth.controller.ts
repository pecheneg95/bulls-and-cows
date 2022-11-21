import { NextFunction, Request, Response } from 'express';

import { authService } from './auth.service';

export class AuthController {
  static signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password, email } = req.body;

      await authService.signUp(username, password, email);

      res.status(201).json({
        message: 'User has been created',
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { password, email } = req.body;

      await authService.login(password, email);

      res.status(200).json({
        message: 'Authentification succeeded.',
      });
    } catch (error) {
      next(error);
    }
  };

  static logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Logout succeeded.');

      res.status(200).json({
        message: 'Logout succeeded.',
      });
    } catch (error) {
      next(error);
    }
  };
}
