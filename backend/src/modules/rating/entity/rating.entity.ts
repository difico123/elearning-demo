import { TableName } from '../../../../database/constant';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: TableName.rating })
export class Rating {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: false })
  userCourseId: number;

  @Column({
    type: 'enum',
    enum: ['1', '2', '3', '4', '5'],
    default: '1',
  })
  rating: string;
}
