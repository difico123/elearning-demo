import { TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.quiz })
export class Quiz {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  topicId: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty({ example: false })
  @Column({ nullable: true })
  shown: boolean;

  @ApiProperty({ example: false })
  @Column({ nullable: true })
  isEdit: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  startTime: Date;

  @ApiProperty({ example: '45' })
  @Column({ nullable: true })
  duration: number;
}
