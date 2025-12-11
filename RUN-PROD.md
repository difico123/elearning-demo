# Hướng dẫn chạy Docker Compose Production

## Bước 0: Fix Docker Permission (nếu gặp lỗi permission denied)

Nếu gặp lỗi `permission denied while trying to connect to the Docker daemon socket`, bạn có 2 cách:

### Cách 1: Thêm user vào docker group (khuyến nghị)
```bash
# Thêm user vào docker group
sudo usermod -aG docker $USER

# Logout và login lại để áp dụng thay đổi
# Hoặc chạy lệnh này để apply ngay (không cần logout)
newgrp docker

# Kiểm tra
docker ps
```

### Cách 2: Dùng sudo (tạm thời)
```bash
# Thêm sudo trước mọi lệnh docker
sudo docker compose -f docker-compose.prod.yaml --env-file .env.prod build
```

## Bước 1: Tạo file environment variables

Tạo file `.env.prod` ở thư mục gốc của project:

```bash
cat > .env.prod << 'EOF'
# Database
DB_PASSWORD=ttlab
DB_NAME=elearning2020
DB_USERNAME=root

# URLs - Thay bằng IP/domain thực tế của server
FRONTEND_URL=http://YOUR_SERVER_IP:8080,http://YOUR_SERVER_IP:8082
API_URL=http://YOUR_SERVER_IP:5001

# Ports
APP_PORT=5001
FRONTEND_PORT=8080
ADMIN_PORT=8082
EOF
```

**Lưu ý:** Thay `YOUR_SERVER_IP` bằng IP thực tế của server (ví dụ: `139.59.123.89`)

## Bước 2: Build và chạy services

```bash
# Build tất cả images
docker compose -f docker-compose.prod.yaml --env-file .env.prod build

# Chạy tất cả services
docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

## Bước 3: Kiểm tra trạng thái

```bash
# Xem trạng thái các containers
docker compose -f docker-compose.prod.yaml ps

# Xem logs
docker compose -f docker-compose.prod.yaml logs -f

# Xem logs của một service cụ thể
docker compose -f docker-compose.prod.yaml logs -f backend
docker compose -f docker-compose.prod.yaml logs -f frontend
docker compose -f docker-compose.prod.yaml logs -f admin
```

## Bước 4: Chạy database migrations (nếu cần)

```bash
# Vào container backend
docker compose -f docker-compose.prod.yaml exec backend sh

# Trong container, chạy migrations
npm run migration:up
npm run seed:run

# Thoát container
exit
```

## Các lệnh hữu ích khác

```bash
# Dừng tất cả services
docker compose -f docker-compose.prod.yaml down

# Dừng và xóa volumes (cẩn thận - sẽ mất data)
docker compose -f docker-compose.prod.yaml down -v

# Restart một service cụ thể
docker compose -f docker-compose.prod.yaml restart backend

# Rebuild và restart
docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build

# Xem ports đang expose
docker compose -f docker-compose.prod.yaml ps --format "table {{.Name}}\t{{.Ports}}"
```

## Kiểm tra services đang chạy

Sau khi chạy, bạn có thể truy cập:

- **Frontend**: `http://YOUR_SERVER_IP:8080`
- **Admin**: `http://YOUR_SERVER_IP:8082`
- **Backend API**: `http://YOUR_SERVER_IP:5001/api/v1`
- **API Docs**: `http://YOUR_SERVER_IP:5001/docs`

## Troubleshooting

### Nếu services không start:

```bash
# Kiểm tra logs để xem lỗi
docker compose -f docker-compose.prod.yaml logs

# Kiểm tra xem ports có bị conflict không
sudo netstat -tulpn | grep -E '3306|6379|5001|8080|8082'
```

### Nếu database connection error:

- Đảm bảo MySQL container đã healthy: `docker compose -f docker-compose.prod.yaml ps`
- Kiểm tra `DB_HOST=mysql` trong backend environment (đã set trong docker-compose.prod.yaml)

### Nếu CORS error:

- Đảm bảo `FRONTEND_URL` trong `.env.prod` bao gồm đúng URLs của frontend và admin
- Restart backend sau khi sửa: `docker compose -f docker-compose.prod.yaml restart backend`

