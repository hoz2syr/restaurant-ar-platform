# Restaurant AR Platform

A full-stack restaurant AR menu platform with bilingual support (Arabic & English) featuring AR menu visualization, online ordering, and comprehensive restaurant management.

## 🌟 Features

- **🍽️ Digital Menu**: Browse restaurant menus with bilingual support
- **📱 AR Visualization**: View menu items in 3D/AR using your mobile device
- **🛒 Online Ordering**: Complete order placement and tracking
- **👨‍💼 Admin Dashboard**: Comprehensive restaurant and order management
- **🌍 Multi-language**: Full support for Arabic (RTL) and English (LTR)
- **🔐 Authentication**: Secure JWT-based authentication
- **📊 Analytics**: Dashboard with real-time statistics

## 🏗️ Architecture

This is a monorepo containing:

- **API** (`apps/api`): NestJS backend with Prisma ORM
- **Web** (`apps/web`): Next.js customer-facing application
- **Admin** (`apps/admin`): Next.js admin dashboard
- **Database** (`packages/database`): Shared Prisma schema

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Redis** - Caching layer
- **JWT** - Authentication
- **OpenTelemetry** - Distributed tracing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **@google/model-viewer** - AR/3D model viewing
- **Zustand** - State management

### DevOps
- **Docker** - Containerization
- **Turbo** - Monorepo build system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15+ (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hoz2syr/restaurant-ar-platform.git
   cd restaurant-ar-platform
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   Or manually:

   ```bash
   # Install dependencies
   npm install

   # Start Docker services
   docker-compose up -d

   # Setup database
   cd packages/database
   npm install
   npx prisma generate
   npx prisma db push
   ```

3. **Start the applications**

   In separate terminals:

   ```bash
   # Terminal 1: API Server
   cd apps/api
   npm run dev
   # Runs on http://localhost:3001

   # Terminal 2: Web App
   cd apps/web
   npm run dev
   # Runs on http://localhost:3000

   # Terminal 3: Admin Dashboard
   cd apps/admin
   npm run dev
   # Runs on http://localhost:3002
   ```

## 📁 Project Structure

```
restaurant-ar-platform/
├── apps/
│   ├── api/              # NestJS backend API
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── guards/   # Auth guards
│   │   │   ├── filters/  # Exception filters
│   │   │   └── shared/   # Shared services
│   │   └── package.json
│   ├── web/              # Customer-facing Next.js app
│   │   ├── app/
│   │   │   ├── components/
│   │   │   └── (pages)/
│   │   ├── hooks/
│   │   └── lib/
│   └── admin/            # Admin dashboard Next.js app
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   └── database/         # Prisma schema & migrations
│       └── prisma/
│           └── schema.prisma
├── docker-compose.yml    # Docker services
└── package.json          # Root package.json
```

## 🗄️ Database Schema

### Core Models

- **User** - System users (customers, admins, restaurant owners)
- **Restaurant** - Restaurant information with bilingual fields
- **Menu** - Restaurant menus
- **MenuItem** - Individual menu items with pricing
- **Asset** - Images and 3D models for menu items
- **Order** - Customer orders with items
- **OrderItem** - Individual items in an order

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/:id` - Get restaurant details
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

### Menus & Items
- `GET /api/menus?restaurantId=:id` - List menus
- `POST /api/menus` - Create menu
- `GET /api/menu-items?menuId=:id` - List menu items
- `POST /api/menu-items` - Create menu item

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status

### Assets
- `POST /api/assets/upload` - Upload file (image/3D model)

## 🎨 Web Application Features

### Customer Features
- Browse restaurants
- View menus with bilingual support
- View menu items in AR (3D models)
- Add items to cart
- Place orders
- Track order history
- Multi-language support (Arabic/English)

### Admin Features
- Dashboard with statistics
- Restaurant management (CRUD)
- Menu management (CRUD)
- Menu item management with file uploads
- Order management with status updates
- User management
- File upload for images and 3D models

## 🔐 Authentication & Authorization

The platform uses JWT-based authentication with role-based access control:

- **CUSTOMER** - Can browse and order
- **RESTAURANT_OWNER** - Can manage their restaurants
- **RESTAURANT_STAFF** - Can manage orders
- **ADMIN** - Full system access

## 🌍 Internationalization

Full support for:
- **Arabic** (ar) - RTL layout
- **English** (en) - LTR layout

All content fields have bilingual variants (e.g., `name` and `nameAr`).

## 📊 Observability

The API includes OpenTelemetry tracing for monitoring:
- Request/response logging
- Performance metrics
- Error tracking
- Custom spans for business logic

## 🧪 Development

### Prisma Commands

```bash
cd packages/database

# Generate Prisma Client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Create migration
npx prisma migrate dev --name migration-name

# Open Prisma Studio
npx prisma studio
```

### Build Commands

```bash
# Build all apps
npm run build

# Build specific app
cd apps/api && npm run build
cd apps/web && npm run build
cd apps/admin && npm run build
```

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **PostgreSQL** (port 5432) - Main database
- **Redis** (port 6379) - Caching and sessions

## 📝 Environment Variables

Each application requires environment variables. See `.env.example` files in:
- `/.env` - Root environment variables
- `/apps/api/.env.example`
- `/apps/web/.env.local.example`
- `/apps/admin/.env.local.example`

## 🚀 Deployment

### Production Build

```bash
# Build all applications
npm run build

# Start API in production
cd apps/api && npm run start:prod

# Start Next.js apps
cd apps/web && npm run start
cd apps/admin && npm run start
```

### Deployment Platforms

- **API**: Can be deployed to any Node.js hosting (AWS, DigitalOcean, Heroku)
- **Web/Admin**: Optimized for Vercel, but works with any Node.js host
- **Database**: PostgreSQL on managed services (AWS RDS, DigitalOcean, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed for restaurant owners who want to provide an innovative AR menu experience to their customers.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation in each app's README

## 🗺️ Roadmap

- [ ] Payment integration (Stripe, PayPal)
- [ ] Push notifications for order updates
- [ ] QR code generation for tables
- [ ] Reservation system
- [ ] Customer reviews and ratings
- [ ] Multi-restaurant search and filtering
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard

---

Made with ❤️ for the restaurant industry
