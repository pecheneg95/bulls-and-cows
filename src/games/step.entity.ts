import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { Game } from './game.entity';

@Entity('step')
export class Step extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

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

  @CreateDateColumn()
  createdAt!: Date;

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
