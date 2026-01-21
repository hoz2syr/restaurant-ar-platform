# 🍽️ Restaurant AR Platform | منصة المطعم بالواقع المعزز

<div dir="rtl">

منصة شاملة لإدارة المطاعم مع قائمة طعام بتقنية الواقع المعزز (AR) - نظام متكامل يشمل الموقع العام، لوحة التحكم، و API Backend.

</div>

A comprehensive restaurant management platform with AR-enhanced menu - Complete system including public website, admin dashboard, and backend API.

---

## 📋 Table of Contents | المحتويات

- [Features | المميزات](#features--المميزات)
- [Tech Stack | التقنيات المستخدمة](#tech-stack--التقنيات-المستخدمة)
- [Project Structure | هيكل المشروع](#project-structure--هيكل-المشروع)
- [Prerequisites | المتطلبات](#prerequisites--المتطلبات)
- [Getting Started | البدء السريع](#getting-started--البدء-السريع)
- [Development | التطوير](#development--التطوير)
- [Database | قاعدة البيانات](#database--قاعدة-البيانات)
- [Architecture | البنية المعمارية](#architecture--البنية-المعمارية)
- [Contributing | المساهمة](#contributing--المساهمة)

---

## ✨ Features | المميزات

<div dir="rtl">

### 🎯 المميزات الأساسية

- **قائمة طعام بالواقع المعزز (AR)**: عرض ثلاثي الأبعاد للأطباق
- **طلبات أونلاين**: نظام طلبات متكامل (Dine-in, Takeaway, Delivery)
- **إدارة الحجوزات**: حجز الطاولات مع إدارة متقدمة
- **نظام الفروع**: إدارة عدة فروع
- **العروض والكوبونات**: نظام شامل للعروض الترويجية
- **تحليلات AR**: تتبع تفاعل المستخدمين مع نماذج AR
- **الدفع المتعدد**: دعم طرق دفع متنوعة
- **متعدد اللغات**: دعم العربية والإنجليزية
- **QR Code للطاولات**: طلب مباشر من الطاولة

</div>

### 🎯 Core Features

- **AR-Enhanced Menu**: 3D visualization of dishes
- **Online Ordering**: Complete ordering system (Dine-in, Takeaway, Delivery)
- **Reservation Management**: Table booking with advanced management
- **Multi-Branch System**: Manage multiple restaurant branches
- **Promotions & Coupons**: Comprehensive promotional system
- **AR Analytics**: Track user interactions with AR models
- **Multi-Payment**: Support for various payment methods
- **Multi-Language**: Arabic and English support
- **Table QR Codes**: Direct ordering from tables

---

## 🛠️ Tech Stack | التقنيات المستخدمة

### Frontend

- **Next.js 14** (App Router) - Web & Admin interfaces
- **React 18** - UI library
- **TypeScript** - Type safety

### Backend

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL 16** - Primary database
- **Redis 7** - Caching & sessions

### Monorepo Tools

- **pnpm** - Package manager
- **Turborepo** - Build system
- **TypeScript** - Shared type definitions

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Local development

---

## 📁 Project Structure | هيكل المشروع

```
restaurant-ar-platform/
├── apps/
│   ├── web/                    # Next.js 14 - Public website
│   ├── admin/                  # Next.js 14 - Admin dashboard
│   └── api/                    # NestJS - Backend API
├── packages/
│   ├── database/               # Prisma Schema + Migrations
│   ├── shared/                 # DTOs + Types + Constants
│   ├── ui/                     # Shared UI Components
│   └── config/                 # Shared Configurations
├── docs/
│   ├── architecture/           # Architecture documentation
│   └── decisions/              # Architecture Decision Records
├── infrastructure/
│   └── docker/                 # Docker configurations
├── package.json                # Root package configuration
├── pnpm-workspace.yaml         # pnpm workspace config
├── turbo.json                  # Turborepo pipeline config
├── tsconfig.base.json          # Base TypeScript config
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── docker-compose.yml          # Docker services
└── CONTRIBUTING.md             # Contribution guidelines
```

---

## 📦 Prerequisites | المتطلبات

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Docker** & **Docker Compose**
- **Git**

---

## 🚀 Getting Started | البدء السريع

### 1. Clone the repository | استنساخ المشروع

```bash
git clone https://github.com/hoz2syr/restaurant-ar-platform.git
cd restaurant-ar-platform
```

### 2. Install dependencies | تثبيت المكتبات

```bash
pnpm install
```

### 3. Setup environment variables | إعداد المتغيرات البيئية

```bash
cp .env.example .env
```

Edit `.env` with your configuration.

### 4. Start Docker services | تشغيل خدمات Docker

```bash
pnpm docker:up
```

This starts:

- PostgreSQL on port 5432
- Redis on port 6379

### 5. Setup database | إعداد قاعدة البيانات

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial data
pnpm db:seed
```

### 6. Start development servers | تشغيل خوادم التطوير

```bash
pnpm dev
```

This starts:

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **Admin Panel**: http://localhost:3002

---

## 💻 Development | التطوير

### Available Scripts | الأوامر المتاحة

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm format           # Format code with Prettier
pnpm type-check       # Run TypeScript type checking

# Database
pnpm db:generate      # Generate Prisma client

---

## ✅ Production Readiness Checklist | جاهزية الإنتاج

- Global error handling enabled (NestJS exception filter)
- Security headers via Helmet
- Rate limiting configured (per IP)
- Strict request validation
- Health check endpoints for API + frontends
- SEO metadata, Open Graph, sitemap, robots

---

## 🌍 Environment Separation | فصل البيئات

Use the following templates for environment-specific settings:

- `.env.example` (development baseline)
- `.env.staging.example` (staging)
- `.env.production.example` (production)

Recommended variables:

- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `THROTTLE_TTL` / `THROTTLE_LIMIT`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WEB_URL`

---

## 🚀 Deployment | النشر

### Frontend (Vercel)

- Deploy `apps/web` as a Vercel project
- Deploy `apps/admin` as a separate Vercel project
- Each app includes a `vercel.json` with pnpm build commands

### Backend (VPS/AWS)

- Use `apps/api/Dockerfile`
- Use `docker-compose.prod.yml` for production orchestration
- Expose port `3001` (API)
- Ensure `JWT_SECRET` and database credentials are set

Health Check:
- `GET /api/health`

---

## 📈 Observability | المراقبة

- Structured logging enabled via NestJS interceptor
- Request duration, IP, and user-agent logged in JSON
- Hooks ready for external monitoring tools (Prometheus/Sentry)

pnpm db:push          # Push schema changes
pnpm db:migrate       # Create migration
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Docker
pnpm docker:up        # Start Docker services
pnpm docker:down      # Stop Docker services
pnpm docker:logs      # View Docker logs

# Individual apps
pnpm --filter @restaurant/web dev
pnpm --filter @restaurant/admin dev
pnpm --filter @restaurant/api dev
```

### Working with Packages | العمل مع الحزم

```bash
# Add dependency to specific package
pnpm --filter @restaurant/web add package-name

# Run script in specific package
pnpm --filter @restaurant/api build
```

---

## 🗄️ Database | قاعدة البيانات

### Schema Overview | نظرة عامة على المخطط

The database includes 19 main models:

1. **User** - System users and administrators
2. **Branch** - Restaurant branches
3. **Table** - Tables with QR codes
4. **Category** - Menu categories
5. **Tag** - Item tags (allergens, dietary, features)
6. **MenuItem** - Menu items with AR support
7. **MenuItemTag** - Many-to-many relationship
8. **Customer** - Customer profiles
9. **CustomerAddress** - Customer addresses
10. **Promotion** - Promotions and coupons
11. **Order** - Customer orders
12. **OrderItem** - Order line items with snapshots
13. **Payment** - Payment transactions
14. **Reservation** - Table reservations
15. **OrderStatusHistory** - Order status tracking
16. **InventoryLog** - Inventory tracking
17. **ArAnalytics** - AR interaction analytics
18. **ActivityLog** - System activity logs
19. **Notification** - User notifications

### Default Admin Credentials | بيانات المدير الافتراضية

After seeding:

- **Email**: admin@restaurant.com
- **Password**: admin123

⚠️ **Change these credentials in production!**

### Managing Migrations | إدارة الترحيلات

```bash
# Create a new migration
pnpm db:migrate

# Apply migrations in production
pnpm db:migrate:deploy

# View database in Prisma Studio
pnpm db:studio
```

---

## 🏗️ Architecture | البنية المعمارية

### Design Principles | المبادئ التصميمية

<div dir="rtl">

1. **Snapshot-First Rule**: جميع العناصر تُحفظ كـ snapshots في الطلبات
2. **Backend is Source of Truth**: Backend هو مصدر الحقيقة الوحيد
3. **No Business Logic in Next.js**: لا منطق أعمال في API Routes
4. **AR as Progressive Enhancement**: AR كميزة تحسينية وليست أساسية

</div>

### Key Architectural Decisions

1. **Snapshot-First Rule**: All items saved as snapshots in orders
2. **Backend is Source of Truth**: Backend is the single source of truth
3. **No Business Logic in Next.js**: No business logic in API Routes
4. **AR as Progressive Enhancement**: AR is enhancement, not core feature

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed rules.

---

## 🤝 Contributing | المساهمة

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Development rules
- Code standards
- Commit conventions
- Pull request process

---

## 📝 License

This project is licensed under the MIT License.

---

## 📞 Support | الدعم

For questions and support:

- Open an issue on GitHub
- Email: support@restaurant.com

---

<div align="center">

**Made with ❤️ for the Restaurant Industry**

صُنع بـ ❤️ لصناعة المطاعم

</div>
