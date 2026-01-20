# Architecture Overview | نظرة عامة على البنية المعمارية

## System Architecture | البنية المعمارية للنظام

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Admin Dashboard (Next.js)  │ Mobile  │
│     Port: 3000      │       Port: 3002           │  (Future)│
└──────────┬──────────┴────────────┬────────────────┴─────────┘
           │                       │
           │   HTTP/REST           │
           │                       │
           ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (NestJS)                       │
│                        Port: 3001                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Auth Module │  │  Menu Module │  │ Order Module │ ... │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────┬──────────────────────┬──────────────────────────┘
            │                      │
            ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │      Redis       │
│   Port: 5432     │    │    Port: 6379    │
└──────────────────┘    └──────────────────┘
```

## Monorepo Structure | هيكل الـ Monorepo

### Apps Directory

```
apps/
├── web/              # Customer-facing website
│   ├── Menu browsing with AR
│   ├── Online ordering
│   ├── Table QR ordering
│   └── Reservations
│
├── admin/            # Admin dashboard
│   ├── Menu management
│   ├── Order management
│   ├── Branch management
│   └── Analytics
│
└── api/              # Backend API
    ├── RESTful API
    ├── Business logic
    ├── Data validation
    └── Database access
```

### Packages Directory

```
packages/
├── database/         # Prisma setup
│   ├── Schema definition
│   ├── Migrations
│   └── Seed data
│
├── shared/           # Shared code
│   ├── Types & DTOs
│   ├── Validation schemas (Zod)
│   ├── Error codes (AR/EN)
│   └── Constants
│
├── ui/               # Shared UI components
│   └── (Future: Reusable components)
│
└── config/           # Shared configurations
    └── (Future: Shared configs)
```

## Data Flow | تدفق البيانات

### Order Creation Flow

```
1. User (Web/Admin)
   │
   ├─> Selects menu items
   │
2. Frontend
   │
   ├─> Sends: { items: [{ menuItemId, quantity }] }
   │
3. Next.js API Route (Thin Proxy)
   │
   ├─> Forwards to Backend API
   │
4. NestJS API
   │
   ├─> Validates input (Zod schema)
   ├─> Fetches menu items from DB
   ├─> Creates snapshots of items
   ├─> Calculates totals (subtotal, tax, discount)
   ├─> Applies promotions
   ├─> Creates order in DB
   │
5. Response
   │
   └─> Returns: { order with calculated totals }
```

### Key Principles in Data Flow

1. **Frontend**: UI only, no calculations
2. **Next.js API Routes**: Thin proxy, forward only
3. **Backend API**: All business logic, calculations, validation
4. **Database**: Single source of truth

## Database Schema | مخطط قاعدة البيانات

### Core Entities

```
User ─────── Branch ─────── Table
                │              │
                │              │
Category ─── MenuItem      Reservation
    │           │
    │           │
Tag ────── MenuItemTag
                │
                │
Customer ──── Order ──── OrderItem
    │           │              │
    │           │              │
CustomerAddress │         MenuItem (snapshot)
                │
            Payment
```

### Important Relationships

- **Branch** has many **Tables**, **Orders**, **Users**
- **MenuItem** belongs to **Category**, has many **Tags**
- **Order** has many **OrderItems** (with snapshots)
- **Customer** has many **Orders**, **Addresses**, **Reservations**

## Technology Decisions | القرارات التقنية

### Why Monorepo?

✅ **Advantages**:
- Shared code between apps
- Single dependency management
- Atomic commits across apps
- Easier refactoring
- Consistent tooling

### Why Next.js 14?

✅ **Advantages**:
- App Router for better structure
- Server components for performance
- Built-in API routes
- Excellent TypeScript support
- Easy deployment (Vercel)

### Why NestJS?

✅ **Advantages**:
- Enterprise-ready framework
- Excellent TypeScript support
- Modular architecture
- Dependency injection
- Built-in validation
- Large ecosystem

### Why PostgreSQL?

✅ **Advantages**:
- Robust relational database
- ACID compliance
- JSON support
- Excellent Prisma support
- Scalable

### Why Prisma?

✅ **Advantages**:
- Type-safe database client
- Excellent migrations
- Auto-completion
- Schema visualization
- Easy seeding

## Security Considerations | اعتبارات الأمان

### Authentication

- JWT tokens for API authentication
- Secure password hashing (bcrypt)
- Role-based access control (RBAC)

### Data Validation

- Input validation in Backend (Zod)
- SQL injection prevention (Prisma)
- XSS prevention (sanitization)

### API Security

- CORS configuration
- Rate limiting (future)
- API key authentication (future)

## Performance Optimization | تحسين الأداء

### Caching Strategy

- Redis for session storage
- Redis for frequently accessed data
- CDN for AR models (future)

### Database Optimization

- Proper indexes on frequently queried fields
- Pagination for large datasets
- Connection pooling

### Frontend Optimization

- Server-side rendering (SSR)
- Static generation where possible
- Lazy loading for AR models
- Image optimization

## Scalability | القابلية للتوسع

### Horizontal Scaling

- Stateless API servers
- Load balancer ready
- Redis for shared sessions

### Vertical Scaling

- Database connection pooling
- Query optimization
- Proper indexing

## Monitoring & Logging | المراقبة والتسجيل

### Activity Logging

- User actions logged in `ActivityLog`
- Order status changes in `OrderStatusHistory`
- AR interactions in `ArAnalytics`

### Error Tracking

- Structured error codes
- Bilingual error messages
- Error logging (future: Sentry)

## Future Enhancements | التحسينات المستقبلية

1. **Mobile Apps** (React Native)
2. **Push Notifications**
3. **Payment Gateway Integration**
4. **Delivery Tracking**
5. **Loyalty Program**
6. **Kitchen Display System**
7. **Real-time Order Updates** (WebSocket)
8. **Advanced Analytics Dashboard**

## References | المراجع

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
