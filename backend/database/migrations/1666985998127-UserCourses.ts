import { TableName, UserCourseStatus } from 'database/constant';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserCourses1666985998127 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.userCourse,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'courseId',
            type: 'int',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(UserCourseStatus),
            enumName: 'statusEnum',
            default: `'${UserCourseStatus.pending}'`,
          },
          {
            name: 'startCourseTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'startBlockTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'blockDuration',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      TableName.userCourse,
      new TableForeignKey({
        columnNames: ['courseId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.course,
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      TableName.userCourse,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: TableName.user,
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX user_courses_index ON ${TableName.userCourse}(userId, courseId) `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.userCourse);
  }
}
