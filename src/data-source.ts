import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '@users';
import { Game, Step } from '@games';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'bulls_and_cows',
  //synchronize: true,
  synchronize: false,
  logging: false,
  entities: [User, Game, Step],
});
