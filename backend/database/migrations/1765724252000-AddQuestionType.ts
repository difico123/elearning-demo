import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { TableName } from '../constant';

export class AddQuestionType1765724252000 implements MigrationInterface {
  name = 'AddQuestionType1765724252000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add type column with default value
    await queryRunner.query(
      `ALTER TABLE ${TableName.question} ADD COLUMN type ENUM('multiple_choice', 'single_choice', 'short_answer') NOT NULL DEFAULT 'multiple_choice'`,
    );

    // Add index on type column for performance
    await queryRunner.query(
      `CREATE INDEX IDX_questions_type ON ${TableName.question}(type)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IDX_questions_type ON ${TableName.question}`,
    );
    await queryRunner.dropColumn(TableName.question, 'type');
  }
}
