import { body } from 'express-validator';

export class AuthValidation {
  static signup = [
    body('username').isString().trim().isLength({ min: 5, max: 256 }).withMessage('Incorrect username format'),
    body('password')
      .isString()
      .trim()
      .isLength({ min: 10 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+[!@#$%^&*()_+=]/gm)
      .withMessage('Incorrect password format'),
    body('email').isString().trim().isEmail().withMessage('Incorrect email format'),
  ];

  static login = [
    body('password')
      .isString()
      .trim()
      .isLength({ min: 10 })
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).+[!@#$%^&*()_+=]/gm)
      .withMessage('Incorrect password format'),
    body('email').isString().trim().isEmail().withMessage('Incorrect email format'),
  ];
}
