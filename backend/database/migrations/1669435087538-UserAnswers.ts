import { TableName } from 'database/constant';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserAnswers1669435087538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.userAnswer,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'answerId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '255',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TableName.userAnswer,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.user,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      TableName.userAnswer,
      new TableForeignKey({
        columnNames: ['answerId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.answer,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX user_answers_index ON ${TableName.userAnswer}(userId, answerId) `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.userAnswer);
  }
}
