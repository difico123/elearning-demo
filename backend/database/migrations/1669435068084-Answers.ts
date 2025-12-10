import { TableName } from 'database/constant';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Answers1669435068084 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.answer,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'questionId',
            type: 'int',
          },
          {
            name: 'content',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'isCorrect',
            type: 'tinyint',
            default: 0,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TableName.answer,
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.question,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.answer);
  }
}
