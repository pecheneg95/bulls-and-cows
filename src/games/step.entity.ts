import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

import { BasicEntity } from './../types/basic.entity';

import { User } from './../users/user.entity';

import { Game } from './game.entity';

@Entity('step')
export class Step extends BasicEntity {
  @Index()
  @Column()
  userId!: number;

  @Index()
  @Column()
  gameId!: number;

  @Column()
  sequence!: number;

  @Column()
  value!: string;

  @Column()
  bulls!: number;

  @Column()
  cows!: number;

  @ManyToOne(() => User, (user) => user.steps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
  })
  user!: User;

  @ManyToOne(() => Game, (game) => game.steps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'gameId',
  })
  game!: Game;
}
