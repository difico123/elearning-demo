import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { Provider, Role, TableName } from '../constant';

export class User1664976452308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TableName.user,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'verified',
            type: 'tinyint',
            isNullable: false,
            default: false,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'avatar',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'enum',
            enum: Object.values(Role),
            enumName: 'roleEnum',
            default: `'${Role.guest}'`,
          },
          {
            name: 'provider',
            type: 'enum',
            enum: [Provider.local, Provider.google],
            enumName: 'roleEnum',
            default: `'${Provider.local}'`,
          },
          {
            name: 'resetToken',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'expiredTokenTime',
            type: 'timestamp',
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

    await queryRunner.query(
      `CREATE UNIQUE INDEX email_index ON ${TableName.user} (email) `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TableName.user);
  }
}
