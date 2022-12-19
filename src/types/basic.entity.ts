import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export class BasicEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
