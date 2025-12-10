import { NotificationType, TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.notification })
export class NotificationCourse {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.studentJoinCourse,
  })
  type: NotificationType;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true })
  sourceId: string;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true, type: 'tinyint', default: false })
  isRead: boolean;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  title: string;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  description: string;

  @ApiProperty({ type: 'date' })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  created_at: Date;

  @ApiProperty({ type: 'date' })
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  updated_at: Date;
}
