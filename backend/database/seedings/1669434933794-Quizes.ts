import { TableName } from '../constant';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class Quizes1669434933794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 2,
        topicId: 1,
        name: 'Đố không vui',
        shown: 1,
        startTime: '2022-12-23T00:00:00.000Z',
        duration: 20,
      },
      {
        id: 3,
        topicId: 2,
        name: 'Bốc thăm',
        shown: 1,
        startTime: '2022-12-24T00:00:00.000Z',
        duration: 15,
      },
      {
        id: 4,
        topicId: 3,
        name: 'Chủ đề 3 nào đó',
        shown: 1,
        startTime: '2022-12-24T00:00:00.000Z',
        duration: 15,
      },
      {
        id: 5,
        topicId: 2,
        name: 'HTML viết tắt của từ gì?',
        shown: 1,
        startTime: '2022-12-23T00:00:00.000Z',
        duration: 15,
      },
      {
        id: 6,
        topicId: 1,
        name: 'Câu hỏi 1',
        shown: 1,
        startTime: '2022-12-16T00:00:00.000Z',
        duration: 25,
      },
    ];

    await queryRunner.manager.getRepository(TableName.quiz).insert(items);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
