import { TableName } from '../../../../database/constant';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.topic })
export class Topic {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  courseId: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  name: string;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  description: string;

  @ApiProperty({ example: 'Html course description' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ example: 'Html course description' })
  @Column({ length: 255, nullable: false })
  video: string;
}
