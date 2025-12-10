import { CommentType, TableName } from '../../../../database/constant';

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.comment })
export class Comment {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  userId: string;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true })
  sourceId: number;

  @Column({
    type: 'enum',
    enum: CommentType,
    default: CommentType.course,
  })
  type: CommentType;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  comment: string;

  @ApiProperty({ type: 'date' })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 3,
    nullable: true
  })
  time: Date;

  @ApiProperty({ example: false})
  @Column({ type: 'boolean', nullable: false, default: false })
  isBad: boolean;

  @ApiProperty({ example: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  isBlock: boolean;
}