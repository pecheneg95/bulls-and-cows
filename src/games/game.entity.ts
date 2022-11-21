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

import { GAME_STATUS } from './games.constants';
import { User } from 'users/user.entity';
import { Step } from 'steps/step.entity';

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
  status!: string;

  @Column({ default: null })
  winnerId!: number;

  @Column('text', { default: null })
  hiddenByCreator!: string;

  @Column('text', { default: null })
  hiddenByOpponent!: string;

  @Column({ default: 4 })
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
