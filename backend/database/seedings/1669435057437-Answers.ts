import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableName } from '../constant';

export class Answers1669435057437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        questionId: 6,
        content: 'Hiếu',
        isCorrect: 1,
      },
      {
        questionId: 6,
        content: 'Đức',
        isCorrect: 0,
      },
      {
        questionId: 6,
        content: 'Bình',
        isCorrect: 0,
      },
      {
        questionId: 6,
        content: 'Vẫn là Bình nhưng ở đáp án D',
        isCorrect: 0,
      },
      {
        questionId: 7,
        content: 'Tùy cách tính',
        isCorrect: 1,
      },
      {
        questionId: 7,
        content: '24',
        isCorrect: 0,
      },
      {
        questionId: 7,
        content: 'Sai',
        isCorrect: 0,
      },
      {
        questionId: 7,
        content: 'Đúng',
        isCorrect: 0,
      },
      {
        questionId: 8,
        content: 'Có tên trùng với tên lớp',
        isCorrect: 0,
      },
      {
        questionId: 8,
        content: 'Không có kiểu dữ liệu trả về ( kể cả kiểu void)',
        isCorrect: 0,
      },
      {
        questionId: 9,
        content: 'Gồm các đối tượng, phương thức của class',
        isCorrect: 0,
      },
      {
        questionId: 10,
        content: 'Đức bảo 9',
        isCorrect: 0,
      },
      {
        questionId: 10,
        content: 'Bình bảo 8.9',
        isCorrect: 0,
      },
      {
        questionId: 10,
        content: 'Bùi Xuân Hiếu tạch',
        isCorrect: 1,
      },
      {
        questionId: 11,
        content: 'Không làm gì',
        isCorrect: 0,
      },
      {
        questionId: 11,
        content: 'Làm gì',
        isCorrect: 0,
      },
      {
        questionId: 12,
        content: 'Không',
        isCorrect: 0,
      },
      {
        questionId: 12,
        content: 'Có',
        isCorrect: 0,
      },
      {
        questionId: 13,
        content: 'Bưng bê',
        isCorrect: 1,
      },
      {
        questionId: 13,
        content: 'Rửa chén',
        isCorrect: 1,
      },
      {
        questionId: 13,
        content: 'Làm 1 con AI nào đấy không để làm gì',
        isCorrect: 0,
      },
      {
        questionId: 13,
        content: 'Docs',
        isCorrect: 0,
      },
      {
        questionId: 14,
        content: 'Hyper Text Makeup Language',
        isCorrect: 0,
      },
      {
        questionId: 14,
        content: 'Hyper Text Markup Language.',
        isCorrect: 1,
      },
      {
        questionId: 14,
        content: 'Hyper Text Mardup Language',
        isCorrect: 0,
      },
      {
        questionId: 15,
        content: '1',
        isCorrect: 0,
      },
      {
        questionId: 15,
        content: '2',
        isCorrect: 0,
      },
      {
        questionId: 15,
        content: '3',
        isCorrect: 1,
      },
      {
        questionId: 8,
        content: 'Tự động được gọi khi một đối tượng thuộc lớp được tạo ra',
        isCorrect: 0,
      },
      {
        questionId: 8,
        content: 'Cả 3 đều đúng',
        isCorrect: 1,
      },
      {
        questionId: 9,
        content: 'Gồm các đối số, các biến, các thuộc tính',
        isCorrect: 0,
      },
      {
        questionId: 9,
        content: 'Hàm tạo loại này sẽ không truyền vào bất kì một đối số nào',
        isCorrect: 1,
      },
      {
        questionId: 9,
        content: 'Gồm các thuộc tính của các đối tượng khác nhau của từng lớp',
        isCorrect: 0,
      },
      {
        questionId: 16,
        content: 'Đưa về mặc định 0',
        isCorrect: 0,
      },
      {
        questionId: 16,
        content: '1 chuỗi rỗng',
        isCorrect: 1,
      },
      {
        questionId: 16,
        content: 'set cho 1 mảng',
        isCorrect: 0,
      },
      {
        questionId: 16,
        content: 'Thêm các điều kiện',
        isCorrect: 0,
      },
      {
        questionId: 17,
        content:
          'Nó được sử dụng để khởi tạo các thành phần dữ liệu khác nhau của các đối tượng khác nhau với các giá trị khác nhau khi chúng được tạo.',
        isCorrect: 1,
      },
      {
        questionId: 17,
        content:
          'Nó được sử dụng để khởi tạo các phạm vi truy cập dữ liệu khác nhau của các đối tượng khác nhau với các giá trị khác nhau khi chúng được tạo.',
        isCorrect: 0,
      },
      {
        questionId: 17,
        content:
          'Nó được sử dụng để khởi tạo các thành phần dữ liệu giống nhau của các thuộc tính khác nhau với các giá trị giống nhau khi chúng được tạo.',
        isCorrect: 0,
      },
      {
        questionId: 17,
        content:
          'Nó không được sử dụng để khởi tạo các thành phần dữ liệu khác nhau của các đối tượng giống nhau với các giá trị khác nhau khi chúng được tạo.',
        isCorrect: 0,
      },
      {
        questionId: 18,
        content: 'nó được dùng để phá hoặc hủy một đối tượng trong lớp',
        isCorrect: 0,
      },
      {
        questionId: 18,
        content:
          '                    "content": "nó được dùng để phá hoặc hủy một đối tượng trong lớp",',
        isCorrect: 0,
      },
      {
        questionId: 18,
        content: 'nó được dùng để khởi tạo hoặc xoá một đối tượng trong lớp.',
        isCorrect: 1,
      },
      {
        questionId: 18,
        content: 'nó được dùng để thêm hoặc xoá một đối tượng trong lớp.',
        isCorrect: 0,
      },
      {
        questionId: 19,
        content: 'Một thiết kế hay mẫu cho các đối tượng cùng kiểu',
        isCorrect: 1,
      },
      {
        questionId: 19,
        content: 'Tập các phần tử cùng loại.',
        isCorrect: 0,
      },
      {
        questionId: 19,
        content: 'Một thể hiện cụ thể cho các đối tượng.',
        isCorrect: 0,
      },
      {
        questionId: 19,
        content: 'Tập các giá trị cùng loại.',
        isCorrect: 0,
      },
      {
        questionId: 20,
        content: 'Máy tính',
        isCorrect: 0,
      },
      {
        questionId: 20,
        content: 'Đồng hồ',
        isCorrect: 0,
      },
      {
        questionId: 20,
        content: 'Xe đạp',
        isCorrect: 0,
      },
      {
        questionId: 20,
        content: 'Tất cả đều đúng',
        isCorrect: 1,
      },
      {
        questionId: 10,
        content: 'Trượt cả lũ',
        isCorrect: 0,
      },
      {
        questionId: 11,
        content: 'Làm web',
        isCorrect: 1,
      },
      {
        questionId: 11,
        content: 'Làm Data',
        isCorrect: 0,
      },
      {
        questionId: 14,
        content: 'Hyper Text Madeup Language',
        isCorrect: 0,
      },
      {
        questionId: 15,
        content: '4',
        isCorrect: 0,
      },
      {
        questionId: 21,
        content: '1',
        isCorrect: 0,
      },
      {
        questionId: 21,
        content: '2',
        isCorrect: 1,
      },
      {
        questionId: 21,
        content: '3',
        isCorrect: 0,
      },
      {
        questionId: 21,
        content: '4',
        isCorrect: 0,
      },
    ];

    await queryRunner.manager.getRepository(TableName.answer).insert(items);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
