import { param } from 'express-validator';

export class UsersValidation {
  static stats = [
    param('userId').notEmpty().isInt({ allow_leading_zeroes: false }).custom((value) => value >= 0)
  ];
}