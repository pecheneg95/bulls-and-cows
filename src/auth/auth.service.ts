import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UnauthorizedError, AUTHENTIFICATION_ERROR_MESSAGE, BadRequestError } from '@errors';

import { UsersRepository } from '@users';

import { EXPIRES_IN, SALT } from './auth.constants';
import { config } from '@config';

export class AuthService {
  static async signUp(username: string, password: string, email: string): Promise<string> {
    const isEmailUsed = !!(await UsersRepository.findByEmail(email));

    if (isEmailUsed) {
      throw new BadRequestError(AUTHENTIFICATION_ERROR_MESSAGE.EMAIL_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(password, SALT);
    const user = await UsersRepository.create(username, hashedPassword, email);
    const secret = config.DEV.JWT_SECRET;

    return jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: EXPIRES_IN });
  }

  static async login(password: string, email: string): Promise<string> {
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(AUTHENTIFICATION_ERROR_MESSAGE.EMAIL_NOT_FOUND);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(AUTHENTIFICATION_ERROR_MESSAGE.INVALID_PASSWORD);
    }

    const secret = config.DEV.JWT_SECRET;

    return jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: EXPIRES_IN });
  }
}
