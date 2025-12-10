# Hướng dẫn Deploy lên Cloud

## Các vấn đề cần fix khi deploy lên cloud:

### 1. **Platform Compatibility**
- ❌ Hiện tại: `platform: linux/arm64/v8` (chỉ work trên ARM64)
- ✅ Cloud thường dùng x86_64/amd64
- **Fix**: Xóa hoặc thay đổi platform trong `docker-compose.prod.yaml`

### 2. **Hardcoded localhost URLs**
- ❌ Hiện tại: `http://localhost:5001`, `http://localhost:8080`
- ✅ Cần thay bằng domain/IP thực tế
- **Fix**: Sử dụng environment variables

### 3. **Volume Mounts (Development)**
- ❌ Hiện tại: Mount source code để hot reload
- ✅ Production: Nên build image và không mount volumes
- **Fix**: Đã tạo `docker-compose.prod.yaml` không có volume mounts

### 4. **Development Mode**
- ❌ Hiện tại: `NODE_ENV=development`
- ✅ Production: `NODE_ENV=production`
- **Fix**: Đã set trong `docker-compose.prod.yaml`

### 5. **Build Production Assets**
- ❌ Frontend/Admin đang chạy dev server
- ✅ Production: Cần build static files và serve bằng nginx
- **Fix**: Đã tạo `Dockerfile.prod` với multi-stage build

## Cách deploy:

### Option 1: Sử dụng docker-compose.prod.yaml

1. **Tạo file `.env` cho production:**
```bash
# .env.prod
DB_PASSWORD=your-secure-password
DB_NAME=elearning2020
DB_USERNAME=root
FRONTEND_URL=https://your-domain.com
API_URL=https://api.your-domain.com
APP_PORT=5001
FRONTEND_PORT=80
ADMIN_PORT=8082
```

2. **Deploy:**
```bash
docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

### Option 2: Deploy từng service riêng (Recommended cho cloud)

**Khuyến nghị**: Trên cloud, nên tách services:
- **Database**: Dùng managed service (AWS RDS, Google Cloud SQL, Azure Database)
- **Redis**: Dùng managed service (AWS ElastiCache, Google Cloud Memorystore)
- **Backend/Frontend/Admin**: Deploy trên container service (ECS, Cloud Run, App Service)

### Option 3: Sử dụng Cloud Provider Services

#### AWS:
- **ECS/EKS** cho containers
- **RDS** cho MySQL
- **ElastiCache** cho Redis
- **ALB** cho load balancing

#### Google Cloud:
- **Cloud Run** cho containers
- **Cloud SQL** cho MySQL
- **Memorystore** cho Redis
- **Load Balancer** cho routing

#### Azure:
- **Container Instances** hoặc **App Service**
- **Azure Database for MySQL**
- **Azure Cache for Redis**

## Checklist trước khi deploy:

- [ ] Xóa `platform: linux/arm64/v8` (hoặc set đúng platform)
- [ ] Thay tất cả `localhost` bằng domain/IP thực tế
- [ ] Set environment variables đúng
- [ ] Build production images
- [ ] Cấu hình CORS với domain thực tế
- [ ] Setup SSL/TLS certificates
- [ ] Cấu hình firewall/security groups
- [ ] Setup database backups
- [ ] Cấu hình monitoring/logging
- [ ] Test kết nối giữa các services

## Lưu ý bảo mật:

1. **Không commit `.env` files** với secrets
2. **Sử dụng secrets management** (AWS Secrets Manager, Google Secret Manager)
3. **Enable SSL/TLS** cho tất cả connections
4. **Restrict database access** (chỉ cho phép từ backend container)
5. **Use strong passwords** cho database và Redis
6. **Enable firewall rules** để chỉ expose ports cần thiết

## Ví dụ deploy trên VPS/Server:

```bash
# 1. Clone repo
git clone <your-repo>
cd elearning-uet

# 2. Tạo .env file
cp .env.example .env.prod
# Edit .env.prod với domain/IP thực tế

# 3. Build và start
docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build

# 4. Run migrations
docker compose -f docker-compose.prod.yaml exec backend npm run migration:up
docker compose -f docker-compose.prod.yaml exec backend npm run seed:run
```

## Troubleshooting:

### Port conflicts:
- Thay đổi ports trong docker-compose nếu port đã được sử dụng

### Network issues:
- Đảm bảo các services có thể communicate qua network name (mysql, redis, backend)

### CORS errors:
- Update `FRONTEND_URL` trong backend environment với domain thực tế

### Database connection:
- Kiểm tra `DB_HOST` phải là service name (mysql) không phải localhost

