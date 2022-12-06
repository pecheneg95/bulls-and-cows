import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '@users';
import { Game, Step } from '@games';
//import * as Migrations from './migrations';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  //password: 'root',
  database: 'bulls_and_cows',
  synchronize: true,
  // synchronize: false,
  logging: false,
  entities: [User, Game, Step],
  //migrations: Object.values(Migrations),
  //migrationsTableName: 'custom_migration_table',
});
