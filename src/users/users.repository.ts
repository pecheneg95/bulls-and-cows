import { User } from './user.entity';
import { USER_ROLE } from './users.constants';

class UsersRepository {
  async create(username: string, password: string, email: string): Promise<User> {
    let user = User.create({
      username,
      password,
      email,
      role: USER_ROLE.USER,
    });

    user = await User.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return User.findOneBy({ id });
  }
}

export default new UsersRepository();
