import { TableName } from '../constant';
import { MigrationInterface, QueryRunner } from 'typeorm';
export class Quizes1669434933794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 2,
        topicId: 1,
        courseId: 1,
        name: 'Đố không vui',
        startTime: '2022-12-23 00:00:00',
        duration: 20,
      },
      {
        id: 3,
        topicId: 2,
        courseId: 1,
        name: 'Bốc thăm',
        startTime: '2022-12-24 00:00:00',
        duration: 15,
      },
      {
        id: 4,
        topicId: 3,
        courseId: 1,
        name: 'Chủ đề 3 nào đó',
        startTime: '2022-12-24 00:00:00',
        duration: 15,
      },
      {
        id: 5,
        topicId: 2,
        courseId: 1,
        name: 'HTML viết tắt của từ gì?',
        startTime: '2022-12-23 00:00:00',
        duration: 15,
      },
      {
        id: 6,
        topicId: 1,
        courseId: 1,
        name: 'Câu hỏi 1',
        startTime: '2022-12-16 00:00:00',
        duration: 25,
      },
    ];

    // Use raw query to ensure courseId is included
    for (const item of items) {
      await queryRunner.query(
        `INSERT INTO ${TableName.quiz} (id, topicId, courseId, name, startTime, duration) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.topicId,
          item.courseId,
          item.name,
          item.startTime,
          item.duration,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
