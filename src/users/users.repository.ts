import { User } from './user.entity';
import { USER_ROLE } from './users.constants';

export class UsersRepository {
  static async findAll(): Promise<User[] | null> {
    return User.find();
  }

  static async create(username: string, password: string, email: string): Promise<User> {
    let user = User.create({
      username,
      password,
      email,
      role: USER_ROLE.USER,
    });

    user = await User.save(user);
    return user;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return User.findOneBy({ email });
  }

  static async findById(id: number): Promise<User | null> {
    return User.findOneBy({ id });
  }
}
