import { NextFunction, Request, Response } from 'express';

import { AuthService } from './auth.service';

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password, email } = req.body;

      await AuthService.signUp(username, password, email);

      res.status(201).json({
        message: 'User has been created',
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password, email } = req.body;

      const auth = await AuthService.login(password, email);

      res.status(200).json({
        message: 'Authentification succeeded.',
        token: auth.token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        message: 'Logout succeeded.',
      });
    } catch (error) {
      next(error);
    }
  }
}
