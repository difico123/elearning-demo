import { TableName, UserCourseStatus } from '../constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCourses1669059281163 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 1,
        courseId: 1,
        userId: '19020201',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-11-05'),
      },
      {
        id: 2,
        courseId: 1,
        userId: '123456abf',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-11-06'),
      },
      {
        id: 3,
        courseId: 1,
        userId: '123456xsabxf',
        status: UserCourseStatus.commentBlocking,
        startCourseTime: new Date('2022-10-05'),
        startBlockTime: new Date(),
        blockDuration: 45,
        
      },
      {
        id: 4,
        courseId: 1,
        userId: '123456xsabxfxa',
        status: UserCourseStatus.expired,
        startCourseTime: new Date('2022-10-05'),
      },
      {
        id: 5,
        courseId: 1,
        userId: '19020356',
        status: UserCourseStatus.pending,
        startCourseTime: new Date('2022-10-05'),
      },
      {
        id: 6,
        courseId: 3,
        userId: '19020201',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-10-05'),
      },
      {
        id: 7,
        courseId: 2,
        userId: '19020201',
        status: UserCourseStatus.reject,
        startCourseTime: new Date('2022-09-05'),
      },
      {
        id: 8,
        courseId: 3,
        userId: '19020346',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-09-05'),
      },
      {
        id: 9,
        courseId: 2,
        userId: '19020166',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-08-05'),
      },
      {
        id: 10,
        courseId: 3,
        userId: '19020361',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-08-05'),
      },
      {
        id: 11,
        courseId: 4,
        userId: '19020201',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-08-05'),
      },
      {
        id: 12,
        courseId: 4,
        userId: '19020321',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-08-05'),
      },
      {
        id: 13,
        courseId: 1,
        userId: '19020151',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-08-05'),
      },
      {
        id: 14,
        courseId: 1,
        userId: '19020152',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-12-31'),
      },
      {
        id: 15,
        courseId: 1,
        userId: '19020153',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-08-05'),
      },
      {
        id: 16,
        courseId: 1,
        userId: '19020286',
        status: UserCourseStatus.accepted,
        startCourseTime: new Date('2022-07-05'),
      },
    ];
    await queryRunner.manager.getRepository(TableName.userCourse).insert(items);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
