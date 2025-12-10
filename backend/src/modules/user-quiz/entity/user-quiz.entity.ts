import { TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.userQuiz })
export class UserQuiz {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  userId: string;

  @ApiProperty({ example: '123abc' })
  @Column({ nullable: false })
  quizId: number;

  @ApiProperty({ example: false })
  @Column({ nullable: true })
  markTotal: number;
}
