import usersRepository from 'users/users.repository';
import { User } from './user.entity';

export class UsersService {
  static allUsers(): Promise<User[] | null> {
    return usersRepository.findAll();
  }

  static async findById(id: number): Promise<User | null> {
    return usersRepository.findById(id);
  }
}
