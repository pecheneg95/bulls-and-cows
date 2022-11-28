import { AppError } from '@errors';
import { UsersRepository } from 'users/users.repository';
import { User } from './user.entity';

export class UsersService {
  static allUsers(): Promise<User[] | null> {
    return UsersRepository.findAll();
  }

  static async findById(id: number): Promise<User | null> {
    return UsersRepository.findById(id);
  }

  static findUser = async (userId: number): Promise<User> => {
    const user = await UsersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  };
}
