import { TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.course })
export class Course {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  categoryId: number;

  @ApiProperty({ example: 'Html course' })
  @Column({ length: 255, nullable: false })
  instructorId: string;

  @ApiProperty({ example: 'Html course' })
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty({ example: 'Html course description' })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', nullable: false, default: false })
  isPublished: boolean;

  @ApiProperty({ example: '0.1$' })
  @Column({ type: 'float', nullable: false, default: 0 })
  price: number;

  @ApiProperty({ example: 'http://locadlhost/course.png' })
  @Column({ length: 255, nullable: true })
  image: string;

  @ApiProperty({ type: 'date' })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
    nullable: true
  })
  startCourseTime: Date;

  @ApiProperty({ type: 'date' })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
    nullable: true
  })
  endCourseTime: Date;

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
