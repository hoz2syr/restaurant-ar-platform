# ============================================
# 🚀 Production Deployment Guide
# Restaurant AR Platform
# ============================================

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.production` to `.env` on production server
- [ ] Set a secure `JWT_SECRET` (use: `openssl rand -base64 64`)
- [ ] Configure `DATABASE_URL` with production credentials
- [ ] Set `CORS_ORIGIN` to your actual domains
- [ ] Update all `NEXT_PUBLIC_*` URLs to production domains

### 2. SSL Certificates
- [ ] Obtain SSL certificates (Let's Encrypt recommended)
- [ ] Place certificates in `nginx/ssl/` directory:
  - `fullchain.pem`
  - `privkey.pem`

### 3. Domain Configuration
- [ ] Configure DNS A records:
  - `yourdomain.com` → Server IP
  - `admin.yourdomain.com` → Server IP
  - `api.yourdomain.com` → Server IP

---

## 🛠️ Deployment Steps

### Option A: Docker Deployment (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/restaurant-ar-platform.git
cd restaurant-ar-platform

# 2. Configure environment
cp .env.production .env
nano .env  # Edit with your production values

# 3. Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Run database migrations
docker exec restaurant-ar-api npx prisma migrate deploy

# 5. Seed initial data (first time only)
docker exec restaurant-ar-api npx prisma db seed

# 6. Verify services are running
docker-compose -f docker-compose.prod.yml ps
```

### Option B: Manual Deployment

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Generate Prisma client
pnpm db:generate

# 3. Run migrations
pnpm db:migrate:deploy

# 4. Seed database (first time)
pnpm db:seed

# 5. Build all applications
NODE_ENV=production pnpm build

# 6. Start applications (use PM2 or systemd)
pm2 start ecosystem.config.js
```

---

## 🔐 Security Hardening

### 1. JWT Secret
```bash
# Generate a secure secret
openssl rand -base64 64
```

### 2. Database Password
```bash
# Generate a secure password
openssl rand -base64 32
```

### 3. Firewall Rules (UFW)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 4. SSL with Let's Encrypt
```bash
# Install certbot
sudo apt install certbot

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d admin.yourdomain.com -d api.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
```

---

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# API Health
curl https://api.yourdomain.com/api/health

# Check all containers
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f api
```

### Database Backup
```bash
# Manual backup
docker exec restaurant-ar-postgres pg_dump -U postgres restaurant_ar > backup_$(date +%Y%m%d).sql

# Automated backup (add to crontab)
0 2 * * * docker exec restaurant-ar-postgres pg_dump -U postgres restaurant_ar > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run new migrations
docker exec restaurant-ar-api npx prisma migrate deploy
```

---

## 🔄 Rollback Strategy

### Pre-Rollback Checklist
- [ ] Identify the issue that requires rollback
- [ ] Check if database migrations were applied in the problematic release
- [ ] Verify that a database backup exists before the deployment
- [ ] Tag current production version in Git for potential re-rollback

### Database Migration Rollback

⚠️ **Important:** Prisma does not support automatic migration rollback. Migrations are forward-only.

**Rollback Options:**

1. **Option A: Restore from Backup (Safest)**
   ```bash
   # Stop the API to prevent data writes
   docker-compose -f docker-compose.prod.yml stop api
   
   # Restore database from backup
   docker exec -i restaurant-ar-postgres psql -U postgres restaurant_ar < backup_YYYYMMDD.sql
   
   # Restart API
   docker-compose -f docker-compose.prod.yml start api
   ```

2. **Option B: Manual Rollback Migration (Advanced)**
   ```bash
   # Create a new migration that reverses the changes
   # Example: If migration added a column, new migration should drop it
   docker exec restaurant-ar-api npx prisma migrate dev --name rollback_feature_x
   docker exec restaurant-ar-api npx prisma migrate deploy
   ```

### Application Rollback

**Docker Deployment:**
```bash
# 1. Pull the previous stable tag/commit
git fetch --tags
git checkout v1.0.0  # Replace with your previous stable version

# 2. Rebuild containers with previous code
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Verify health endpoints
curl https://api.yourdomain.com/api/health
```

**Image-Based Rollback (Recommended for Docker):**
```bash
# 1. Tag images before each deployment
docker tag restaurant-ar-api:latest restaurant-ar-api:v1.0.1
docker tag restaurant-ar-web:latest restaurant-ar-web:v1.0.1
docker tag restaurant-ar-admin:latest restaurant-ar-admin:v1.0.1

# 2. When rollback is needed, use previous image tag
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d  # Will use previous tagged images
```

### Post-Rollback Verification
```bash
# 1. Check all services are running
docker-compose -f docker-compose.prod.yml ps

# 2. Verify health endpoints
curl https://api.yourdomain.com/api/health

# 3. Test critical user flows
# - Customer menu viewing
# - Admin login
# - Order creation (if applicable)

# 4. Monitor logs for errors
docker-compose -f docker-compose.prod.yml logs -f --tail=100
```

### Rollback Best Practices
1. **Always backup database before deploying**
   ```bash
   # Run before each deployment
   docker exec restaurant-ar-postgres pg_dump -U postgres restaurant_ar > backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test migrations in staging first**
   - Never run untested migrations directly in production
   - Verify migration safety (backward compatible)

3. **Version tagging**
   ```bash
   # Tag each production release
   git tag -a v1.0.1 -m "Production release 1.0.1"
   git push origin v1.0.1
   ```

4. **Monitor after deployment**
   - Watch health endpoints for at least 15 minutes post-deployment
   - Review error logs
   - Test critical features

---

## 🌐 URLs After Deployment

| Service | URL |
|---------|-----|
| Customer Website | https://yourdomain.com |
| Admin Dashboard | https://admin.yourdomain.com |
| API | https://api.yourdomain.com/api |
| API Health Check | https://api.yourdomain.com/api/health |

---

## 🔧 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs api

# Check container status
docker ps -a
```

### Database connection issues
```bash
# Test database connection
docker exec restaurant-ar-postgres psql -U postgres -c "SELECT 1"

# Check if database exists
docker exec restaurant-ar-postgres psql -U postgres -l
```

### SSL Certificate issues
```bash
# Verify certificate
openssl x509 -in nginx/ssl/fullchain.pem -text -noout

# Test SSL
curl -vI https://yourdomain.com
```

---

## 📞 Admin Credentials (Default)

> ⚠️ **Change these immediately after first login!**

- **Email:** admin@restaurant.com
- **Password:** admin123

---

## 📁 Important Files

```
├── .env.production          # Production environment template
├── docker-compose.prod.yml  # Production Docker setup
├── nginx/
│   ├── nginx.conf          # Nginx configuration
│   └── ssl/                # SSL certificates (create this)
├── apps/
│   ├── api/Dockerfile      # API container
│   ├── admin/Dockerfile    # Admin container
│   └── web/Dockerfile      # Web container
└── DEPLOYMENT.md           # This file
```
