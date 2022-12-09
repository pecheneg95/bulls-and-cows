import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../users/user.entity';

import { Step } from './step.entity';
import { GAME_STATUS, DEFAULT_HIDDEN_LENGTH } from './games.constants';

@Entity('game')
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  creatorId!: number;

  @Column()
  opponentId!: number;

  @Column({
    type: 'enum',
    enum: GAME_STATUS,
    default: GAME_STATUS.CREATED,
  })
  status!: GAME_STATUS;

  @Column({ default: null, nullable: true })
  winnerId!: number;

  @Column({ default: null, nullable: true })
  hiddenByCreator!: string;

  @Column({ default: null, nullable: true })
  hiddenByOpponent!: string;

  @Column({ default: DEFAULT_HIDDEN_LENGTH })
  hiddenLength!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.createdGames, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'creatorId',
  })
  creator!: User;

  @ManyToOne(() => User, (user) => user.joinedGames, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'opponentId',
  })
  opponent!: User;

  @OneToMany(() => Step, (steps) => steps.game)
  steps!: Step[];
}
