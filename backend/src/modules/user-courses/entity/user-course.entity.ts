import { TableName, UserCourseStatus } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.userCourse })
export class UserCourse {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  courseId: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    enum: UserCourseStatus,
    default: UserCourseStatus.pending,
  })
  status: UserCourseStatus;

  @ApiProperty({ type: 'date' })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  startCourseTime: Date;

  @ApiProperty({ type: 'date' })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  startBlockTime: Date;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  blockDuration: number;

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
