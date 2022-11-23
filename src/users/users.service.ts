//import { AppError } from '@errors';
import usersRepository from 'users/users.repository';
import { User } from './user.entity';

export class UsersService {
  static async findById(id: number): Promise<User | null> {
    return usersRepository.findById(id);
  }
}
