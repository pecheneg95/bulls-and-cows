import 'mocha';
import { describe } from 'mocha';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import * as lodash from 'lodash';

import { connectToDatabase } from '@utils';
import { config } from '@config';

import { User } from './../../src/users/user.entity';
import { Game } from './../../src/games/game.entity';
import { BadRequestError, ForbiddenError, GAMES_ERROR_MESSAGE, NotFoundError } from '@errors';
import { GamesService, GAME_STATUS, SORT_DIRECTION, Step } from '@games';
import { USER_ROLE } from '@users';

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

const TEST_USER_3 = {
  email: 'user3@test.com',
  password: 'Password!!!3',
  username: 'user3',
};

const offset = 0;
const limit = 20;

let connection: DataSource;

let testUser1: User;
let testUser2: User;
let testUser3: User;

let testGame1: Game;
let testGame2: Game;
let testGame3: Game;

describe('games/games.service.ts', () => {
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

    testUser3 = User.create({
      username: TEST_USER_3.username,
      password: TEST_USER_3.password,
      email: TEST_USER_3.email,
      role: USER_ROLE.USER,
    });

    await testUser1.save();
    await testUser2.save();
    await testUser3.save();

    testGame1 = Game.create({
      creatorId: testUser1.id,
      opponentId: testUser2.id,
      status: GAME_STATUS.FINISHED,
      winnerId: testUser1.id,
      hiddenByCreator: '1234',
      hiddenByOpponent: '4321',
    });

    testGame2 = Game.create({
      creatorId: testUser2.id,
      opponentId: testUser1.id,
      status: GAME_STATUS.PLAYING,
      hiddenByCreator: '5678',
      hiddenByOpponent: '8765',
    });

    testGame3 = Game.create({
      creatorId: testUser1.id,
      opponentId: testUser3.id,
      status: GAME_STATUS.FINISHED,
      hiddenByCreator: '3456',
      hiddenByOpponent: '6543',
    });

    await testGame1.save();
    await testGame2.save();
    await testGame3.save();
  });

  after('Disconnect from DB.', async () => {
    await testUser1.remove();
    await testUser2.remove();
    await testUser3.remove();
    await testGame1.remove();
    await testGame2.remove();
    await testGame3.remove();
    await connection.destroy();
  });

  describe('GamesService.findById():', () => {
    it('Return null if game not found.', async () => {
      const fakeId = testGame1.id + 100;
      const game = await GamesService.findById(fakeId);

      expect(game).to.equal(null);
    });

    it('Game search successfully.', async () => {
      const game = (await GamesService.findById(testGame1.id)) as Game;

      expect(lodash.isEqual(testGame1, game)).to.equal(true);
    });
  });

  describe('GamesService.findByIdOrFail():', () => {
    it('Throws NotFoundError if game not found.', async () => {
      try {
        const fakeId = testGame1.id + 100;

        await GamesService.findByIdOrFail(fakeId);
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError, GAMES_ERROR_MESSAGE.GAME_NOT_FOUND);
      }
    });

    it('Game search successfully.', async () => {
      const game = (await GamesService.findByIdOrFail(testGame1.id)) as Game;

      expect(lodash.isEqual(testGame1, game)).to.equal(true);
    });
  });

  describe('GamesService.getGame():', () => {
    it('Return null if game not found.', async () => {
      const fakeGameId = testGame1.id + 100;
      const game = await GamesService.getGame(fakeGameId, testUser1.id);

      expect(game.gameForUser).to.equal(null);
    });

    it('Game search successfully.', async () => {
      const game = (await GamesService.getGame(testGame1.id, testUser1.id)) as {
        gameForUser: Game;
        steps: null;
      };

      expect(game.gameForUser.id).to.equal(testGame1.id);
    });

    it('Get GameForCreator if user is creator in game.', async () => {
      const game = (await GamesService.getGame(testGame1.id, testUser1.id)) as {
        gameForUser: Game;
        steps: null;
      };

      expect(game.gameForUser.hiddenByCreator);
      expect(game.gameForUser.hiddenByOpponent).to.equal(undefined);
    });

    it('Get GameForOpponent if user is opponent in game.', async () => {
      const game = (await GamesService.getGame(testGame1.id, testUser2.id)) as {
        gameForUser: Game;
        steps: null;
      };

      expect(game.gameForUser.hiddenByCreator).to.equal(undefined);
      expect(game.gameForUser.hiddenByOpponent);
    });

    it('Throws ForbiddenError if user is not member of game.', async () => {
      try {
        await GamesService.getGame(testGame1.id, testUser3.id);
      } catch (error) {
        expect(error).to.be.instanceOf(ForbiddenError, GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
      }
    });
  });

  describe('GamesService.getAllGamesWithParams():', () => {
    it('Games search with all params successfully.', async () => {
      const userIds = [testUser2.id, testUser3.id];
      const gameStatus = GAME_STATUS.FINISHED;
      const sortDirection = SORT_DIRECTION.ASC;

      const result = await GamesService.getAllGamesWithParams(
        testUser1.id,
        offset,
        limit,
        userIds,
        gameStatus,
        sortDirection
      );

      expect(result.totalCount).to.equal(2);
      expect(testGame1.id).to.equal(result.games[0].id);
      expect(testGame3.id).to.equal(result.games[1].id);
    });

    it('Games search without optional params successfully.', async () => {
      const result = await GamesService.getAllGamesWithParams(testUser1.id, offset, limit);

      expect(result.totalCount).to.equal(3);
      expect(testGame1.id).to.equal(result.games[0].id);
      expect(testGame2.id).to.equal(result.games[1].id);
      expect(testGame3.id).to.equal(result.games[2].id);
    });

    it('Games search with "userIds" optinal param successfully.', async () => {
      const userIds = [testUser2.id];

      const result = await GamesService.getAllGamesWithParams(testUser1.id, offset, limit, userIds);

      expect(result.totalCount).to.equal(2);
      expect(testGame1.id).to.equal(result.games[0].id);
      expect(testGame2.id).to.equal(result.games[1].id);
    });

    it('Games search with "gameStatus" optinal param successfully.', async () => {
      const gameStatus = GAME_STATUS.PLAYING;

      const result = await GamesService.getAllGamesWithParams(testUser1.id, offset, limit, undefined, gameStatus);

      expect(result.totalCount).to.equal(1);
      expect(testGame2.id).to.equal(result.games[0].id);
    });

    it('Games search with "sortDirection" optinal param successfully.', async () => {
      const sortDirection = SORT_DIRECTION.DESC;

      const result = await GamesService.getAllGamesWithParams(
        testUser1.id,
        offset,
        limit,
        undefined,
        undefined,
        sortDirection
      );

      expect(result.totalCount).to.equal(3);
      expect(testGame3.id).to.equal(result.games[0].id);
      expect(testGame2.id).to.equal(result.games[1].id);
      expect(testGame1.id).to.equal(result.games[2].id);
    });

    it('Games search without optional params and with "offset" param successfully.', async () => {
      const offset = 1;

      const result = await GamesService.getAllGamesWithParams(testUser1.id, offset, limit);

      expect(result.totalCount).to.equal(3);
      expect(result.games.length).to.equal(2);
      expect(testGame2.id).to.equal(result.games[0].id);
      expect(testGame3.id).to.equal(result.games[1].id);
    });

    it('Games search without optional params and with "limit" param successfully.', async () => {
      const limit = 2;

      const result = await GamesService.getAllGamesWithParams(testUser1.id, offset, limit);

      expect(result.totalCount).to.equal(3);
      expect(result.games.length).to.equal(2);
      expect(testGame1.id).to.equal(result.games[0].id);
      expect(testGame2.id).to.equal(result.games[1].id);
    });

    it('Games search without optional params and with "limit" and "offset" param successfully.', async () => {
      const offset = 1;
      const limit = 1;

      const result = await GamesService.getAllGamesWithParams(testUser1.id, offset, limit);

      expect(result.totalCount).to.equal(3);
      expect(result.games.length).to.equal(1);
      expect(testGame2.id).to.equal(result.games[0].id);
    });
  });

  describe('GamesService.calculateWinner():', () => {
    it('Hidden answer was guessed by creator.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.FINISHED,
        hiddenByCreator: '5678',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const lastStep = Step.create({
        userId: testUser1.id,
        gameId: testGame.id,
        sequence: 1,
        value: '1234',
        bulls: 4,
        cows: 0,
      });
      const currentStep = Step.create({
        userId: testUser2.id,
        gameId: testGame.id,
        sequence: 2,
        value: '4321',
        bulls: 0,
        cows: 0,
      });

      await lastStep.save();
      await currentStep.save();

      const game = await GamesService.calculateWinner(testGame, lastStep, currentStep);

      expect(game.winnerId).to.equal(testUser1.id);

      await testGame.remove();
      await lastStep.remove();
      await currentStep.remove();
    });

    it('Hidden answer was guessed by opponent.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.FINISHED,
        hiddenByCreator: '5678',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const lastStep = Step.create({
        userId: testUser2.id,
        gameId: testGame.id,
        sequence: 1,
        value: '5678',
        bulls: 4,
        cows: 0,
      });
      const currentStep = Step.create({
        userId: testUser1.id,
        gameId: testGame.id,
        sequence: 2,
        value: '2345',
        bulls: 0,
        cows: 3,
      });

      await lastStep.save();
      await currentStep.save();

      const game = await GamesService.calculateWinner(testGame, lastStep, currentStep);

      expect(game.winnerId).to.equal(testUser2.id);

      await testGame.remove();
      await lastStep.remove();
      await currentStep.remove();
    });

    it('Hidden answer was guessed by creator and opponent.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.FINISHED,
        hiddenByCreator: '5678',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const lastStep = Step.create({
        userId: testUser1.id,
        gameId: testGame.id,
        sequence: 1,
        value: '1234',
        bulls: 4,
        cows: 0,
      });
      const currentStep = Step.create({
        userId: testUser2.id,
        gameId: testGame.id,
        sequence: 2,
        value: '5678',
        bulls: 4,
        cows: 0,
      });

      await lastStep.save();
      await currentStep.save();

      const game = await GamesService.calculateWinner(testGame, lastStep, currentStep);

      expect(game.winnerId).to.equal(null);

      await testGame.remove();
      await lastStep.remove();
      await currentStep.remove();
    });
  });

  describe('GamesService.changeStatus():', () => {
    it('Game status changed successfully.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '5678',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const game = await GamesService.changeStatus(testGame, GAME_STATUS.FINISHED);

      expect(game.status).to.equal(GAME_STATUS.FINISHED);

      await testGame.remove();
    });
  });

  describe('GamesService.getLastStepInGame():', () => {
    it('Last step in game successfully received.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const testStep1 = Step.create({
        userId: testUser1.id,
        gameId: testGame.id,
        sequence: 1,
        value: '5678',
        bulls: 0,
        cows: 0,
      });
      const testStep2 = Step.create({
        userId: testUser2.id,
        gameId: testGame.id,
        sequence: 2,
        value: '5678',
        bulls: 0,
        cows: 0,
      });

      await testStep1.save();
      await testStep2.save();

      const lastStep = await GamesService.getLastStepInGame(testGame.id);

      expect(lodash.isEqual(lastStep, testStep2)).to.equal(true);

      await testGame.remove();
      await testStep1.remove();
      await testStep2.remove();
    });

    it('Successfully got null for a game that has no steps.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const lastStep = await GamesService.getLastStepInGame(testGame.id);

      expect(lastStep).to.equal(null);

      await testGame.remove();
    });
  });

  describe('GamesService.getStepsForGame():', () => {
    it('All steps in game successfully received.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const testStep1 = Step.create({
        userId: testUser1.id,
        gameId: testGame.id,
        sequence: 1,
        value: '5678',
        bulls: 0,
        cows: 0,
      });
      const testStep2 = Step.create({
        userId: testUser2.id,
        gameId: testGame.id,
        sequence: 2,
        value: '5678',
        bulls: 0,
        cows: 0,
      });

      await testStep1.save();
      await testStep2.save();

      const steps = (await GamesService.getStepsForGame(testGame.id)) as Step[];

      expect(steps.length).to.equal(2);
      expect(lodash.isEqual(steps[0], testStep1)).to.equal(true);
      expect(lodash.isEqual(steps[1], testStep2)).to.equal(true);

      await testGame.remove();
      await testStep1.remove();
      await testStep2.remove();
    });

    it('Successfully got null for a game that has no steps.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const steps = await GamesService.getLastStepInGame(testGame.id);

      expect(steps).to.equal(null);

      await testGame.remove();
    });
  });

  describe('GamesService.makeStep():', () => {
    it('First step was completed successfully.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.CREATED,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const stepValue = '5243';
      const result = await GamesService.makeStep(testUser1.id, testGame.id, stepValue);

      expect(result.isCorrect).to.equal(false);
      expect(result.isGameOver).to.equal(false);
      expect(result.step.userId).to.equal(testUser1.id);
      expect(result.step.bulls).to.equal(1);
      expect(result.step.cows).to.equal(2);

      await testGame.remove();
      await result.step.remove();
    });

    it('Throw ForbiddenError if user not member game.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.CREATED,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const stepValue = '5243';

      try {
        await GamesService.makeStep(testUser3.id, testGame.id, stepValue);
      } catch (error) {
        expect(error).to.be.instanceOf(ForbiddenError, GAMES_ERROR_MESSAGE.NOT_A_MEMBER);
      }

      await testGame.remove();
    });

    it('Throw ForbiddenError if game finished.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.FINISHED,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const stepValue = '5243';

      try {
        await GamesService.makeStep(testUser1.id, testGame.id, stepValue);
      } catch (error) {
        expect(error).to.be.instanceOf(ForbiddenError, GAMES_ERROR_MESSAGE.CANNOT_MAKE_STEP_AFTER_FINISHED);
      }

      await testGame.remove();
    });

    it('Throw BadRequestError if step length not equal game settings.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const stepValue = '12345';

      try {
        await GamesService.makeStep(testUser1.id, testGame.id, stepValue);
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError, GAMES_ERROR_MESSAGE.INCORRECT_STEP_LENGTH);
      }

      await testGame.remove();
    });

    it('Throw ForbiddenError if user tries to take two steps in a row.', async () => {
      const testGame = Game.create({
        creatorId: testUser1.id,
        opponentId: testUser2.id,
        status: GAME_STATUS.PLAYING,
        hiddenByCreator: '1234',
        hiddenByOpponent: '1234',
      });

      await testGame.save();

      const step1Value = '2345';
      const step2Value = '3456';
      const resultStep1 = await GamesService.makeStep(testUser1.id, testGame.id, step1Value);

      try {
        await GamesService.makeStep(testUser1.id, testGame.id, step2Value);
      } catch (error) {
        expect(error).to.be.instanceOf(ForbiddenError, GAMES_ERROR_MESSAGE.NOT_YOU_TURN);
      }

      await testGame.remove();
      await resultStep1.step.remove();
    });
  });
});
