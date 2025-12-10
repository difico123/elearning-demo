import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableName, NotificationType } from '../constant';

export class Notifications1667388294344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [];

    await queryRunner.manager
      .getRepository(TableName.notification)
      .insert(items);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
