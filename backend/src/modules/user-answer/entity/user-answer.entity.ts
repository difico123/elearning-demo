import { TableName } from '../../../../database/constant';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.userAnswer })
export class UserAnswer {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  userId: string;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  answerId: number;
}
