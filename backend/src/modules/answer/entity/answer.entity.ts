import { TableName } from '../../../../database/constant';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.answer })
export class Answer {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  questionId: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  content: string;

  @ApiProperty({ example: false })
  @Column({ nullable: true })
  isCorrect: boolean;
}
