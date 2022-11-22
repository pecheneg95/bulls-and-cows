import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import UsersRepository from '../users/users.repository';
import { AppError } from '@errors';
import { JWT_SECRET } from './auth.constants';

class AuthService {
  async signUp(username: string, password: string, email: string): Promise<void> {
    const conflict = await UsersRepository.findByEmail(email);

    if (conflict) {
      throw new AppError('Email already in use', 422);
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    await UsersRepository.create(username, hashedPassword, email);
  }

  async login(password: string, email: string): Promise<{ token: string }> {
    const user = await UsersRepository.findByEmail(email);
    const authError = new AppError('Authentification failed. Check your email/password.', 401);

    if (!user) {
      throw authError;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw authError;
    }

    return { token: jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' }) };
  }
}

export const authService = new AuthService();
