import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UnauthorizedError, AUTH_ERROR_MESSAGE, BadRequestError } from '@errors';

import { UsersRepository } from '@users';

import { EXPIRES_IN, SALT } from './auth.constants';

export class AuthService {
  static async signUp(username: string, password: string, email: string): Promise<void> {
    const isEmailUsed = !!(await UsersRepository.findByEmail(email));

    if (isEmailUsed) {
      throw new BadRequestError(AUTH_ERROR_MESSAGE.EMAIL_IN_USE);
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    await UsersRepository.create(username, hashedPassword, email);
  }

  static async login(password: string, email: string): Promise<string> {
    const secret = process.env.JWT_SECRET as string;
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(AUTH_ERROR_MESSAGE.EMAIL_NOT_FOUND);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(AUTH_ERROR_MESSAGE.INVALID_PASSWORD);
    }

    return jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: EXPIRES_IN });
  }
}
