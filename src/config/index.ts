import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from './../users/user.entity';
import { Game } from './../games/game.entity';
import { Step } from './../games/step.entity';
import * as Migrations from './../migrations';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('JWT secret not specified');

const DB: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'bulls_and_cows',
  synchronize: true,
  //synchronize: false,
  logging: true,
  entities: [User, Game, Step],
  migrations: Object.values(Migrations),
};

const DB_TEST: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'bulls_and_cows_test',
  synchronize: true,
  //synchronize: false,
  logging: false,
  entities: [User, Game, Step],
};

export const config = {
  DEV: {
    PORT: 8080,
    SOCKETS_PORT: 8081,
    DB,
    JWT_SECRET,
  },
  TEST: {
    PORT: 8080,
    SOCKETS_PORT: 8081,
    DB_TEST,
    JWT_SECRET,
  },
};
