import { param } from 'express-validator';

export class UsersValidation {
  static stats = [
    param('userId')
      .isInt({ allow_leading_zeroes: false })
      .withMessage('Value is not number')
      .custom((value) => value >= 0)
      .withMessage('Value is not positive'),
  ];
}
