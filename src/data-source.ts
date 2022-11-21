import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';
import { Game } from './games/game.entity';
import { Step } from './steps/step.entity';
//import * as Migrations from './migrations';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 27852,
  username: 'postgres',
  //password: process.env.DB_PASSWORD,
  password: 'root',
  database: 'postgres',
  synchronize: true,
  // synchronize: false,
  logging: true,
  entities: [User, Game, Step],
  //migrations: Object.values(Migrations),
  //migrationsTableName: 'custom_migration_table',
});
