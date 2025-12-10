import { TableName } from '../constant';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class Ratings1669291453294 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        userCourseId: 1,
        rating: '1',
      },
      {
        userCourseId: 2,
        rating: '3',
      },
      {
        userCourseId: 3,
        rating: '4',
      },
      {
        userCourseId: 4,
        rating: '5',
      },
      {
        userCourseId: 6,
        rating: '2',
      },
      {
        userCourseId: 8,
        rating: '4',
      },
      {
        userCourseId: 9,
        rating: '2',
      },
      {
        userCourseId: 10,
        rating: '5',
      },
      {
        userCourseId: 11,
        rating: '5',
      },
      {
        userCourseId: 12,
        rating: '5',
      },
    ];

    await queryRunner.manager.getRepository(TableName.rating).insert(items);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
