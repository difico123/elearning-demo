import { CommentType, NotificationType, TableName } from 'database/constant';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Comments1668911829507 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.comment,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'sourceId',
            type: 'int',
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(CommentType),
            enumName: 'type',
            default: `'${CommentType.course}'`,
          },
          {
            name: 'comment',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'time',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'isBad',
            type: 'tinyint',
            isNullable: false,
            default: false,
          },
          {
            name: 'isBlock',
            type: 'tinyint',
            isNullable: false,
            default: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TableName.comment,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.user,
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.comment);
  }
}
