import { TableName } from 'database/constant';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Ratings1669291442694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.rating,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userCourseId',
            type: 'int',
          },
          {
            name: 'rating',
            type: 'enum',
            enum: ['1','2','3','4','5'],
            enumName: 'type',
            default: `'1'`,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      TableName.rating,
      new TableForeignKey({
        columnNames: ['userCourseId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.userCourse,
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX usercourse_index ON ${TableName.rating} (userCourseId) `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.rating);
  }
}
