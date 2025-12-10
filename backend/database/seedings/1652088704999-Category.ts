import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableName } from '../constant';

export class Category1652088704999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        image: 'software',
        name: 'IT và phần mềm',
      },
      {
        image: 'business',
        name: 'Kinh doanh',
      },
      {
        image: 'design',
        name: 'Sáng tạo',
      },
      {
        image: 'personal-development',
        name: 'Phát triển bản thân',
      },
      {
        image: 'marketing',
        name: 'Marketing',
      },
      {
        image: 'development',
        name: 'Lập trình',
      },
      {
        image: 'music',
        name: 'Nghệ thuật',
      },
      {
        image: 'photography',
        name: 'Nhiếp ảnh',
      },
    ];

    let itemDatas = items.map((item, index) => {
      return {
        ...item,
        id: index + 1,
      };
    });

    await queryRunner.manager
      .getRepository(TableName.category)
      .insert(itemDatas);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
