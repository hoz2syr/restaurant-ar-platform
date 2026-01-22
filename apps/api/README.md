# Restaurant AR Platform API

A comprehensive NestJS API application for the Restaurant AR Platform, providing backend services for restaurant management, menu operations, user authentication, and AR model handling.

## Features

- 🔐 JWT Authentication with Passport
- 👥 User Management (CRUD operations)
- 🏪 Restaurant Management with owner authorization
- 📋 Menu and Menu Item Management
- 📦 Order Management
- 📁 File Upload handling (images and 3D models)
- 🔒 Role-based Access Control (RBAC)
- 🌍 Multi-language support (Arabic RTL and English)
- 📊 OpenTelemetry Tracing
- 🛡️ Security with Helmet
- ✅ Request Validation with class-validator
- 📝 Logging Interceptor
- 🔄 CORS enabled

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm or npm

## Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your database credentials and configuration
```

## Environment Variables

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_ar?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DESTINATION=./uploads
OTEL_SERVICE_NAME=restaurant-ar-api
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

## Running the Application

```bash
# Development
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create restaurant (Restaurant Owner/Admin)
- `PATCH /api/restaurants/:id` - Update restaurant (Owner/Admin)
- `DELETE /api/restaurants/:id` - Delete restaurant (Owner/Admin)
- `GET /api/restaurants/owner/my-restaurants` - Get owner's restaurants

### Menus
- `GET /api/menus` - Get all menus
- `GET /api/menus?restaurantId=:id` - Get menus by restaurant
- `GET /api/menus/:id` - Get menu by ID
- `POST /api/menus` - Create menu (Restaurant Owner/Admin)
- `PATCH /api/menus/:id` - Update menu (Owner/Admin)
- `DELETE /api/menus/:id` - Delete menu (Owner/Admin)

### Menu Items
- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items?menuId=:id` - Get items by menu
- `GET /api/menu-items/:id` - Get menu item by ID
- `POST /api/menu-items` - Create menu item (Restaurant Owner/Admin)
- `PATCH /api/menu-items/:id` - Update menu item (Owner/Admin)
- `DELETE /api/menu-items/:id` - Delete menu item (Owner/Admin)

### Assets
- `POST /api/assets/upload/image` - Upload image (Owner/Admin)
- `POST /api/assets/upload/model` - Upload 3D model (Owner/Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/my-orders` - Get current user's orders
- `GET /api/orders/restaurant/:restaurantId` - Get restaurant orders (Owner/Admin)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order status (Owner/Admin)
- `DELETE /api/orders/:id` - Delete order (Admin only)

### Health
- `GET /api/health` - API health check
- `GET /health` - Application health check

## Architecture

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── restaurants/   # Restaurant management
│   │   ├── menus/         # Menu management
│   │   ├── menu-items/    # Menu item management
│   │   ├── assets/        # File upload handling
│   │   └── orders/        # Order management
│   ├── shared/
│   │   ├── prisma.service.ts    # Prisma client wrapper
│   │   └── tracing.service.ts   # OpenTelemetry tracing
│   ├── guards/
│   │   ├── jwt-auth.guard.ts    # JWT authentication guard
│   │   └── roles.guard.ts       # Role-based authorization guard
│   ├── decorators/
│   │   ├── roles.decorator.ts        # Roles decorator
│   │   └── current-user.decorator.ts # Current user decorator
│   ├── interceptors/
│   │   └── logging.interceptor.ts    # Request logging
│   ├── filters/
│   │   └── http-exception.filter.ts  # Exception handling
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Roles

- `ADMIN` - Full access to all resources
- `RESTAURANT_OWNER` - Manage own restaurants, menus, and orders
- `CUSTOMER` - Place orders, view menus

## License

MIT
