import { body } from 'express-validator';

import { MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, PASSWORD_FORMAT } from './auth.constants';

export class AuthValidation {
  static signup = [
    body('username')
      .isString()
      .trim()
      .isLength({ min: MIN_USERNAME_LENGTH, max: MAX_USERNAME_LENGTH })
      .withMessage('Incorrect username format'),
    body('password')
      .isString()
      .trim()
      .isLength({ min: MIN_PASSWORD_LENGTH })
      .matches(PASSWORD_FORMAT)
      .withMessage('Incorrect password format'),
    body('email').isString().trim().isEmail().withMessage('Incorrect email format'),
  ];

  static login = [
    body('password')
      .isString()
      .trim()
      .isLength({ min: MIN_PASSWORD_LENGTH })
      .matches(PASSWORD_FORMAT)
      .withMessage('Incorrect password format'),
    body('email').isString().trim().isEmail().withMessage('Incorrect email format'),
  ];
}
