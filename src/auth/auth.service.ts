import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { ConflictError, UnauthorizedError } from '@errors';

import { UsersRepository } from '@users';

import { SALT, JWT_SECRET } from './auth.constants';

export class AuthService {
  static async signUp(username: string, password: string, email: string): Promise<void> {
    const isEmailUsed = !!(await UsersRepository.findByEmail(email));

    if (isEmailUsed) {
      throw new ConflictError('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    await UsersRepository.create(username, hashedPassword, email);
  }

  static async login(password: string, email: string): Promise<string> {
    const user = await UsersRepository.findByEmail(email);
    const authErrorMessage = 'Authentification failed. Check your email/password.';

    if (!user) {
      throw new UnauthorizedError(authErrorMessage);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedError(authErrorMessage);
    }

    return jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  }
}
