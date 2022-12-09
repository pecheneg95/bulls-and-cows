import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { Game } from '../games/game.entity';
import { Step } from '../games/step.entity';

import { USER_ROLE } from './users.constants';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
  })
  role!: USER_ROLE;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Game, (game) => game.creator)
  createdGames!: Game[];

  @OneToMany(() => Game, (game) => game.opponent)
  joinedGames!: Game[];

  @OneToMany(() => Step, (step) => step.user)
  steps!: Step[];
}
