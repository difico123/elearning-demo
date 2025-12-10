import { TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.favorite })
export class Favorite {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  courseId: number;

  @ApiProperty({ example: '123abc' })
  @Column({ length: 255, nullable: false })
  userId: string;

  @ApiProperty({ type: 'date' })
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 3,
  })
  time: Date;
}
