import { Provider, Role, TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: TableName.user })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.guest,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Provider,
    default: Provider.local,
  })
  provider: Provider;

  @Column()
  resetToken: string;

  @Column({
    type: 'timestamp',
    precision: 3,
  })
  expiredTokenTime: Date | null;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  updated_at: Date;
}
