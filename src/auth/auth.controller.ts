import { NextFunction, Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginRequest, SignUpRequest } from './auth.types';

export class AuthController {
  static async signUp(req: SignUpRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password, email } = req.body;

      const authToken = await AuthService.signUp(username, password, email);

      res.status(201).json(authToken);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: LoginRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password, email } = req.body;

      const authToken = await AuthService.login(password, email);

      res.status(200).json(authToken);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200);
    } catch (error) {
      next(error);
    }
  }
}
