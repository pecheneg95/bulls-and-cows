import { param } from 'express-validator';

export class UsersValidation {
  static me = [
  param('userId').isNumeric()
  ];
}