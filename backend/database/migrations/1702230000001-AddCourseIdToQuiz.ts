import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCourseIdToQuiz1702230000001 implements MigrationInterface {
  name = 'AddCourseIdToQuiz1702230000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE quizes ADD COLUMN courseId INT NULL AFTER topicId`,
    );

    await queryRunner.query(
      `UPDATE quizes q JOIN topics t ON q.topicId = t.id SET q.courseId = t.courseId`,
    );

    await queryRunner.query(
      `ALTER TABLE quizes MODIFY courseId INT NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX IDX_quizes_courseId ON quizes(courseId)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IDX_quizes_courseId ON quizes`);
    await queryRunner.query(`ALTER TABLE quizes DROP COLUMN courseId`);
  }
}

