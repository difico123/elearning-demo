
# Tổng quan

- Sorademic: Trang web học trực tuyến ứng dụng AI lọc tin nhắn spam/tục

- Các tính năng: UPDATING

- Công nghệ sử dụng
  + Back-end: NestJS, MySQL, Redis, SocketIO, HLS(HTTP Live-streaming)
  + Front-end: VueJS, Bootstrap+SASS, Element-UI, SocketIO, TinyMCE(Rich-text editor)
  + AI: Neural Network
  + Admin: ReactJS
  
# Yêu cầu cài đặt
  * npm, node (v16+), python 3.9 hoặc các phiên bản tương thích 

# Khởi động hệ thống
  - Bước 1: Tải source code
    + Vào cmd chạy git clone https://github.com/ducnl-ttlab/elearning-uet.git
    + Hoặc download file zip và giải nén
  - Bước 2: Cài đặt môi trường
    + Tạo 1 file .env ở trong mỗi thư mục backend, frontend và admin
    + Copy nội dung file .env.example và paste vào file .env vừa tạo
  - Bước 3: Cài đặt thư viện/node modules: vào cmd của các folder tương ứng và chạy các lệnh sau:
    + Admin: npm install
    + Front-end: yarn
    + Back-end: pip tensorflow-cpu và yarn
  - Bước 4: Chạy hệ thống:
    + Khởi động MySQL: sử dụng XAMPP hoặc các cách khác để kết nối với MySQL Server
    + Vào thư mục back-end, chạy yarn start:dev và đảm bảo không có lỗi
      +) Admin: npm serve
      +) Front-end: yarn run serve
    + Khi Front-end hiện cổng 8080 / Admin cổng 8081 tức là hệ thống đã chạy thành công.
    + Đăng nhập vào trang Admin với tài khoản đã được cấp;
      
