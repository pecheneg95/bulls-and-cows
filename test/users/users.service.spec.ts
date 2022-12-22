import 'mocha';
import { describe } from 'mocha';
import { expect } from 'chai';

import { DataSource } from 'typeorm';
import * as lodash from 'lodash';

import { connectToDatabase } from '@utils';
import { config } from '@config';
import { UsersService, UserStats, USER_ROLE } from '@users';
import { GAME_STATUS } from '@games';
import { NotFoundError, USERS_ERROR_MESSAGE } from '@errors';

import { User } from './../../src/users/user.entity';
import { Game } from './../../src/games/game.entity';

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
let testUser1: User;
let testUser2: User;
let testGame: Game;

describe('users/users.service.ts', () => {
  before('Connect to DB.', async () => {
    connection = await connectToDatabase(config.TEST.DB_TEST);
    testUser1 = User.create({
      username: TEST_USER_1.username,
      password: TEST_USER_1.password,
      email: TEST_USER_1.email,
      role: USER_ROLE.USER,
    });

    testUser2 = User.create({
      username: TEST_USER_2.username,
      password: TEST_USER_2.password,
      email: TEST_USER_2.email,
      role: USER_ROLE.USER,
    });

    await testUser1.save();
    await testUser2.save();

    testGame = Game.create({
      creatorId: testUser1.id,
      opponentId: testUser2.id,
      status: GAME_STATUS.FINISHED,
      winnerId: testUser1.id,
    });

    await testGame.save();
  });

  after('Disconnect from DB.', async () => {
    await testUser1.remove();
    await testUser2.remove();
    await testGame.remove();
    await connection.destroy();
  });

  describe('UsersService.findById():', () => {
    it('Throws NotFoundError if user not found.', async () => {
      try {
        const fakeId = testUser1.id + 100;

        await UsersService.findById(fakeId);
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError, USERS_ERROR_MESSAGE.NOT_FOUND);
      }
    });

    it('User search successfully.', async () => {
      const user = (await UsersService.findById(testUser1.id)) as User;

      expect(lodash.isEqual(testUser1, user)).to.equal(true);
    });
  });

  describe('UsersService.findByEmail():', () => {
    it('Throws NotFoundError if user not found.', async () => {
      try {
        await UsersService.findByEmail('error' + TEST_USER_1.email);
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError, USERS_ERROR_MESSAGE.NOT_FOUND);
      }
    });

    it('User search successfully.', async () => {
      const user = (await UsersService.findByEmail(TEST_USER_1.email)) as User;

      expect(lodash.isEqual(testUser1, user)).to.equal(true);
    });
  });

  describe('UsersService.getStats():', () => {
    it('User stats successfully received.', async () => {
      const statsUser1 = (await UsersService.getStats(testUser1.id)) as UserStats;
      const statsUser2 = (await UsersService.getStats(testUser2.id)) as UserStats;

      expect(
        statsUser1.gamesCount === 1 &&
          statsUser2.gamesCount === 1 &&
          statsUser1.winsCount === 1 &&
          statsUser2.winsCount === 0 &&
          statsUser1.lossesCount === 0 &&
          statsUser2.lossesCount === 1
      ).to.equal(true);
    });

    it('Throws NotFoundError if user not found.', async () => {
      try {
        const fakeId = testUser1.id + 100;

        await UsersService.getStats(fakeId);
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError, USERS_ERROR_MESSAGE.NOT_FOUND);
      }
    });
  });
});
