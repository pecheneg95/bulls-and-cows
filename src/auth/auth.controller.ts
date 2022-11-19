import { NextFunction, Request, Response } from 'express';

export class AuthController {
  static signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;

      console.log('Username: ', username);
      console.log('Email: ', email);
      console.log('Password: ', password);
      console.log('User has been created');

      res.status(201).json({
        message: 'User has been created',
      });
    } catch (error) {
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      console.log('Email: ', email);
      console.log('Password: ', password);
      console.log('Authentification succeeded.');

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
