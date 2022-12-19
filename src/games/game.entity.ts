import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { BasicEntity } from './../types/basic.entity';

import { User } from './../users/user.entity';

import { GAME_STATUS, DEFAULT_HIDDEN_LENGTH } from './games.constants';
import { Step } from './step.entity';

@Entity('game')
export class Game extends BasicEntity {
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
