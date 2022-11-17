import { NextFunction, Request, Response } from 'express';

export class AuthController {
  static signUpPOST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;

      console.log('Username: ', username)
      console.log('Email: ', email)
      console.log('Password: ', password)

      res.status(201).json({
        message: 'User has been created',
      });
    } catch (error) {
      next(error);
    }
  };

  static loginPOST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      console.log('Email: ', email)
      console.log('Password: ', password)

      res.status(200).json({
        message: 'Authentification succeeded.',
      });
    } catch (error) {
      next(error);
    }
  };

  
  static logoutPOST = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('Logout')

      res.status(200).json({
        message: 'Logout succeeded.',
      });
    } catch (error) {
      next(error);
    }
  };
}