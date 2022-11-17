import { body } from 'express-validator';

export class AuthValidation {
  static signup = [
    body('email').isString().trim().isEmail(),
    body('password')
      .isString()
      .trim()
      .isLength({ min: 10 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+[!@#$%^&*()_+=]/gm),
    body('username').isString().trim().isLength({ min: 5, max: 256 }),
  ];

  static login = [
    body('email').isString().trim().isEmail(),
    body('password')
      .isString()
      .trim()
      .isLength({ min: 10 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+[!@#$%^&*()_+=]/gm),
  ];
}
