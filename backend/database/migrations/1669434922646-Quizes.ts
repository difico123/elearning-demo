import { TableName } from 'database/constant';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Quizes1669434922646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.quiz,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'topicId',
            type: 'int',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'shown',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'isEdit',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'startTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
            default: 60, // minutes
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TableName.quiz,
      new TableForeignKey({
        columnNames: ['topicId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.topic,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.quiz);
  }
}
