# Docker Compose Setup

Docker Compose file để chạy toàn bộ hệ thống Elearning (Backend, Frontend, Admin) cùng lúc.

## Services

- **mysql**: MySQL 8.0 database
- **redis**: Redis cache
- **backend**: NestJS API server (port 5001)
- **frontend**: Vue.js frontend (port 8080)
- **admin**: React admin panel (port 8082)

## Cách sử dụng

### 1. Khởi động tất cả services

```bash
docker compose up -d
```

### 2. Xem logs

```bash
# Tất cả services
docker compose logs -f

# Một service cụ thể
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f admin
```

### 3. Dừng services

```bash
docker compose down
```

### 4. Dừng và xóa volumes (database data)

```bash
docker compose down -v
```

### 5. Rebuild services

```bash
# Rebuild tất cả
docker compose build

# Rebuild một service cụ thể
docker compose build backend
```

### 6. Restart một service

```bash
docker compose restart backend
```

## Setup ban đầu

### 1. Chạy migrations và seeds

Sau khi backend đã khởi động, chạy migrations:

```bash
docker compose exec backend npm run migration:up
docker compose exec backend npm run seed:run
```

### 2. Kiểm tra services

- Frontend: http://localhost:8080
- Admin: http://localhost:8082
- Backend API: http://localhost:5001
- API Docs: http://localhost:5001/docs

## Environment Variables

Các biến môi trường được cấu hình trong `docker-compose.yaml`. Để thay đổi, sửa file `docker-compose.yaml` hoặc tạo file `.env` riêng.

## Troubleshooting

### Backend không kết nối được MySQL

Kiểm tra MySQL đã sẵn sàng:
```bash
docker compose exec mysql mysqladmin ping -h localhost -u root -p
```

### Frontend/Admin không kết nối được Backend

Kiểm tra CORS settings trong `backend/src/main.ts` và đảm bảo `FRONTEND_URL` bao gồm đúng các origins.

### Port đã được sử dụng

Nếu port bị conflict, sửa ports mapping trong `docker-compose.yaml`:
```yaml
ports:
  - "8081:8080"  # Thay đổi port bên trái
```

## Development với Hot Reload

Volumes đã được mount để code changes tự động reload:
- `./backend:/usr/src/app` - Backend code
- `./frontend:/app` - Frontend code  
- `./admin:/usr/app` - Admin code

## Production Build

Để build production, cần tạo Dockerfile riêng cho production với multi-stage builds.

