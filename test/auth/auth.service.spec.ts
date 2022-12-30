import 'mocha';
import { describe } from 'mocha';
import { expect } from 'chai';

import { DataSource } from 'typeorm';

import { connectToDatabase } from '@utils';
import { config } from '@config';
import { UsersService, USER_ROLE } from '@users';
import { AuthService } from './../../src/auth/auth.service';

import { User } from './../../src/users/user.entity';
import { AUTHENTIFICATION_ERROR_MESSAGE, BadRequestError, UnauthorizedError } from '@errors';

const TEST_USER_1 = {
  email: 'user1@test.com',
  password: 'Password!!!1',
  username: 'user1',
};

const TEST_USER_2 = {
  email: 'user2@test.com',
  password: 'Password!!!2',
  username: 'user2',
};

let connection: DataSource;
let testUser: User;

describe('auth/auth.service.ts', () => {
  before('Connect to DB.', async () => {
    connection = await connectToDatabase(config.TEST.DB_TEST);
    testUser = User.create({
      email: TEST_USER_1.email,
      username: TEST_USER_1.username,
      password: TEST_USER_1.password,
      role: USER_ROLE.USER,
    });

    await testUser.save();
  });

  after('Disconnect from DB.', async () => {
    await testUser.remove();
    await connection.destroy();
  });

  describe('AuthService.signUp():', () => {
    it('Throws an error if email already in use.', async () => {
      try {
        await AuthService.signUp(TEST_USER_1.username, TEST_USER_1.password, TEST_USER_1.email);
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError, AUTHENTIFICATION_ERROR_MESSAGE.EMAIL_IN_USE);
      }
    });

    it('Saves new user successfully.', async () => {
      await AuthService.signUp(TEST_USER_2.username, TEST_USER_2.password, TEST_USER_2.email);
      const user = await UsersService.findByEmail(TEST_USER_2.email);
      if (user) {
        await user.remove();
      }
    });
  });

  describe('AuthService.login():', () => {
    it('Throws UnauthorizedError if email not found.', async () => {
      try {
        await AuthService.login(TEST_USER_2.password, TEST_USER_2.email);
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedError, AUTHENTIFICATION_ERROR_MESSAGE.EMAIL_NOT_FOUND);
      }
    });

    it('Throws UnauthorizedError if password is not correct.', async () => {
      try {
        const incorrectPassword = 'error' + TEST_USER_1.password;
        await AuthService.login(incorrectPassword, TEST_USER_1.email);
      } catch (error) {
        expect(error).to.be.instanceOf(UnauthorizedError, AUTHENTIFICATION_ERROR_MESSAGE.INVALID_PASSWORD);
      }
    });
  });
});
