import { TableName } from '../constant';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Questions1669435029049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 6,
        quizId: 2,
        name: 'Ai là người đầu tiên đặt chân lên mặt trăng?',
        mark: 10,
      },
      {
        id: 7,
        quizId: 2,
        name: 'Một ngày có bao nhiêu giờ',
        mark: 5,
      },
      {
        id: 8,
        quizId: 2,
        name: 'Sự khác biệt giữa hàm tạo và hàm thành viên thông thường?',
        mark: 5,
      },
      {
        id: 9,
        quizId: 2,
        name: 'Hàm khởi tạo không tham số gồm:',
        mark: 5,
      },
      {
        id: 10,
        quizId: 3,
        name: 'Dự án Sorademic sẽ được bao nhiêu điểm?',
        mark: 100,
      },
      {
        id: 11,
        quizId: 3,
        name: 'Ra trường Hiếu làm gì',
        mark: 10,
      },
      {
        id: 12,
        quizId: 4,
        name: 'Tay Đức có to không?',
        mark: 10,
      },
      {
        id: 13,
        quizId: 4,
        name: 'Bình làm gì trong dự án?',
        mark: 5,
      },
      {
        id: 14,
        quizId: 5,
        name: 'Không có tiêu đề',
        mark: 20,
      },
      {
        id: 15,
        quizId: 5,
        name: 'Cấu trúc của phần tử gồm mấy phần',
        mark: 10,
      },
      {
        id: 16,
        quizId: 2,
        name: 'Khi muốn set 1 giá trị ngầm định cho kiểu chuỗi ta sẽ set cho nó bằng giá trị gì:',
        mark: 5,
      },
      {
        id: 17,
        quizId: 2,
        name: 'Công dụng của hàm khởi tạo có tham số?',
        mark: 5,
      },
      {
        id: 18,
        quizId: 6,
        name: 'Hàm huỷ là gì?',
        mark: 10,
      },
      {
        id: 19,
        quizId: 6,
        name: 'Lớp đối tượng là:',
        mark: 10,
      },
      {
        id: 20,
        quizId: 6,
        name: 'Trong các phương án sau, phương án nào mô tả đối tượng:',
        mark: 10,
      },
      {
        id: 21,
        quizId: 5,
        name: 'Có mấy loại thẻ?',
        mark: 10,
      },
    ];

    await queryRunner.manager.getRepository(TableName.question).insert(items);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
