import { TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.question })
export class Question {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  quizId: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty({ example: 5 })
  @Column({ nullable: false })
  mark: number;

  @ApiProperty({ example: 'multiple_choice' })
  @Column({
    type: 'enum',
    enum: ['multiple_choice', 'single_choice', 'short_answer'],
    default: 'multiple_choice',
    nullable: false,
  })
  type: string;
}
