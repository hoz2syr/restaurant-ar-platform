# Contributing to Restaurant AR Platform | المساهمة في المشروع

<div dir="rtl">

شكراً لاهتمامك بالمساهمة في منصة المطعم بالواقع المعزز! هذا المستند يحتوي على القواعد الملزمة والإرشادات التي يجب اتباعها عند المساهمة في المشروع.

</div>

Thank you for your interest in contributing to the Restaurant AR Platform! This document contains mandatory rules and guidelines to follow when contributing to the project.

---

## 📋 Table of Contents | المحتويات

- [Mandatory Development Rules](#mandatory-development-rules--القواعد-الملزمة)
- [Code Standards](#code-standards--معايير-الكود)
- [Git Workflow](#git-workflow--سير-العمل-مع-git)
- [Testing](#testing--الاختبار)
- [Pull Request Process](#pull-request-process--إجراءات-طلب-الدمج)

---

## 🚨 Mandatory Development Rules | القواعد الملزمة

<div dir="rtl">

### القواعد الأساسية الأربعة

هذه القواعد **إلزامية** ويجب اتباعها في جميع الأوقات:

</div>

These rules are **MANDATORY** and must be followed at all times:

### 1️⃣ Snapshot-First Rule | قاعدة الـ Snapshot أولاً

<div dir="rtl">

**القاعدة**: جميع عناصر الطلب يجب أن تُحفظ كـ snapshot كامل في وقت الطلب.

**السبب**:

- أسعار المنتجات قد تتغير
- العناصر قد تُحذف من القائمة
- الطلبات القديمة يجب أن تعكس الحالة الدقيقة وقت الطلب

</div>

**Rule**: All order items MUST be saved as a complete snapshot at order time.

**Reason**:

- Prices may change
- Items may be deleted from menu
- Historical orders must reflect exact state at order time

**Implementation**:

```typescript
// ✅ CORRECT - Full snapshot
const orderItem = {
  menuItemId: item.id,
  quantity: 2,
  price: item.price, // Current price
  itemSnapshot: {
    name: item.name,
    nameAr: item.nameAr,
    price: item.price,
    description: item.description,
    image: item.image,
    arModelUrl: item.arModelUrl,
    // ... all relevant fields
  },
};

// ❌ WRONG - Only reference
const orderItem = {
  menuItemId: item.id,
  quantity: 2,
};
```

---

### 2️⃣ Backend is Source of Truth | Backend هو مصدر الحقيقة

<div dir="rtl">

**القاعدة**: جميع حسابات الأعمال والتحقق يجب أن تتم في Backend API، وليس في Frontend.

**السبب**:

- الأمان: Frontend يمكن التلاعب به
- الاتساق: منطق واحد لجميع العملاء
- الصيانة: تغيير القواعد في مكان واحد

</div>

**Rule**: All business calculations and validation MUST happen in Backend API, not Frontend.

**Reason**:

- Security: Frontend can be manipulated
- Consistency: Single logic for all clients
- Maintenance: Change rules in one place

**Examples**:

```typescript
// ✅ CORRECT - Backend calculates
POST /api/orders
{
  items: [{ menuItemId: "123", quantity: 2 }],
  promotionCode: "SAVE20"
}

// Backend response with calculated totals
{
  subtotal: 100,
  discount: 20,
  tax: 12,
  total: 92
}

// ❌ WRONG - Frontend calculates and sends
POST /api/orders
{
  items: [...],
  subtotal: 100,
  discount: 20,
  tax: 12,
  total: 92  // Never trust these from frontend!
}
```

**What MUST be done in Backend**:

- Price calculations
- Discount applications
- Tax calculations
- Inventory checks
- Promotion validations
- Payment processing
- Order status changes

---

### 3️⃣ No Business Logic in Next.js API Routes | لا منطق أعمال في Next.js

<div dir="rtl">

**القاعدة**: Next.js API Routes يجب أن تكون thin proxies فقط - تُعيد توجيه الطلبات إلى NestJS API.

**السبب**:

- فصل المسؤوليات
- إعادة استخدام الكود
- Backend واحد لجميع العملاء
- سهولة الاختبار

</div>

**Rule**: Next.js API Routes MUST be thin proxies only - forward requests to NestJS API.

**Reason**:

- Separation of concerns
- Code reusability
- Single backend for all clients
- Easy testing

**Examples**:

```typescript
// ✅ CORRECT - Thin proxy
// apps/web/src/app/api/menu/route.ts
export async function GET() {
  const response = await fetch(`${API_URL}/menu`);
  const data = await response.json();
  return Response.json(data);
}

// ❌ WRONG - Business logic in Next.js
export async function GET() {
  const prisma = new PrismaClient();
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    include: { category: true },
  });

  // ❌ Business logic here!
  const processedItems = items.map((item) => ({
    ...item,
    discountedPrice: item.price * 0.9,
  }));

  return Response.json(processedItems);
}
```

**What Next.js API Routes CAN do**:

- Forward requests to NestJS
- Handle authentication cookies
- Add request headers
- Format responses for frontend

**What Next.js API Routes CANNOT do**:

- Database queries
- Business calculations
- Validation logic
- Data transformations

---

### 4️⃣ AR = Progressive Enhancement | AR كميزة تحسينية

<div dir="rtl">

**القاعدة**: AR يجب أن تكون ميزة اختيارية، وليست متطلباً أساسياً.

**السبب**:

- ليست جميع الأجهزة تدعم AR
- المستخدمون قد يفضلون عدم استخدام AR
- النظام يجب أن يعمل بدون AR

</div>

**Rule**: AR MUST be an optional feature, not a core requirement.

**Reason**:

- Not all devices support AR
- Users may prefer not to use AR
- System must work without AR

**Implementation**:

```typescript
// ✅ CORRECT - AR as enhancement
interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;           // Required
  hasArModel: boolean;      // Flag
  arModelUrl?: string;      // Optional
  arThumbnail?: string;     // Optional
}

// Component design
function MenuItemCard({ item }: Props) {
  return (
    <div>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.price} SAR</p>

      {/* AR is optional enhancement */}
      {item.hasArModel && (
        <button>View in AR</button>
      )}
    </div>
  );
}

// ❌ WRONG - AR required
interface MenuItem {
  id: string;
  name: string;
  arModelUrl: string;  // Required - Wrong!
}
```

**Guidelines**:

- Always provide fallback images
- Make AR features discoverable but not intrusive
- Track AR usage in analytics
- Handle AR errors gracefully
- Test all features without AR enabled

---

## 💻 Code Standards | معايير الكود

### TypeScript

- Use strict TypeScript
- No `any` types (use `unknown` if needed)
- Define proper interfaces/types
- Export types from shared package

### Naming Conventions

```typescript
// Files
menu-item.dto.ts          // Kebab-case for files
MenuItemService.ts        // PascalCase for classes

// Variables & Functions
const menuItems = [];     // camelCase
function getMenuItem() {} // camelCase

// Types & Interfaces
interface MenuItem {}     // PascalCase
type OrderStatus = ...;   // PascalCase

// Constants
const MAX_ORDER_ITEMS = 50; // UPPER_SNAKE_CASE
```

### Code Organization

```typescript
// ✅ CORRECT - Organized imports
// 1. External dependencies
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// 2. Internal packages
import { CreateOrderInput } from '@restaurant/shared';

// 3. Relative imports
import { OrderService } from './order.service';
```

### Error Handling

```typescript
// ✅ CORRECT - Use error codes from shared package
import { ERROR_CODES, getErrorMessage } from '@restaurant/shared';

throw new NotFoundException({
  code: ERROR_CODES.MENU_ITEM_NOT_FOUND.code,
  message: getErrorMessage('MENU_ITEM_NOT_FOUND', 'ar'),
});

// ❌ WRONG - Hardcoded messages
throw new NotFoundException('Menu item not found');
```

---

## 🔄 Git Workflow | سير العمل مع Git

### Branch Naming

```bash
feature/ar-menu-viewer     # New feature
fix/order-calculation      # Bug fix
docs/api-documentation     # Documentation
refactor/menu-service      # Code refactoring
```

### Commit Messages

Follow conventional commits:

```bash
feat: add AR model viewer component
fix: correct order total calculation
docs: update API documentation
refactor: simplify menu item query
test: add order service tests
chore: update dependencies
```

Arabic commits are also acceptable:

```bash
feat: إضافة عارض نماذج AR
fix: تصحيح حساب إجمالي الطلب
```

---

## 🧪 Testing | الاختبار

### Before Submitting PR

```bash
# 1. Lint code
pnpm lint

# 2. Type check
pnpm type-check

# 3. Format code
pnpm format

# 4. Build all apps
pnpm build

# 5. Run tests (when available)
pnpm test
```

### Testing Checklist

- [ ] Code builds without errors
- [ ] All linting rules pass
- [ ] TypeScript has no errors
- [ ] Manual testing completed
- [ ] Database migrations work
- [ ] No sensitive data committed

---

## 📝 Pull Request Process | إجراءات طلب الدمج

### PR Checklist

Before submitting a PR:

- [ ] Code follows all 4 mandatory rules
- [ ] Code passes all checks (lint, type-check, build)
- [ ] Branch is up to date with main
- [ ] Commit messages are clear
- [ ] PR description explains changes
- [ ] Screenshots added for UI changes
- [ ] Database changes documented
- [ ] No breaking changes (or documented)

### PR Template

```markdown
## Description | الوصف

Brief description of changes in English and Arabic.

## Type of Change | نوع التغيير

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Mandatory Rules Compliance | الامتثال للقواعد الملزمة

- [ ] Snapshot-First Rule followed
- [ ] All business logic in Backend
- [ ] No business logic in Next.js API Routes
- [ ] AR as progressive enhancement

## Testing | الاختبار

- [ ] Lint passed
- [ ] Type check passed
- [ ] Build successful
- [ ] Manual testing completed

## Screenshots | لقطات الشاشة

(If applicable)
```

---

## 🚫 Common Mistakes to Avoid | أخطاء شائعة يجب تجنبها

### ❌ DON'T

```typescript
// 1. Don't store only IDs
const orderItem = { menuItemId: "123" };

// 2. Don't calculate prices in frontend
const total = items.reduce((sum, item) => sum + item.price, 0);
submitOrder({ items, total });

// 3. Don't put business logic in Next.js
export async function POST(req: Request) {
  const prisma = new PrismaClient();
  // Database queries here ❌
}

// 4. Don't make AR required
<MenuItem arModel={item.arModel} /> // Crashes if no AR

// 5. Don't hardcode error messages
throw new Error('Item not found');
```

### ✅ DO

```typescript
// 1. Store complete snapshots
const orderItem = {
  menuItemId: "123",
  itemSnapshot: { /* full item data */ }
};

// 2. Let backend calculate
const response = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({ items }) // Backend calculates total
});

// 3. Use thin proxies in Next.js
export async function POST(req: Request) {
  return fetch(`${API_URL}/orders`, { /* forward */ });
}

// 4. Make AR optional
{item.hasArModel && <ArViewer model={item.arModel} />}

// 5. Use error codes
import { ERROR_CODES } from '@restaurant/shared';
throw new NotFoundException(ERROR_CODES.MENU_ITEM_NOT_FOUND);
```

---

## 📚 Additional Resources | مصادر إضافية

- [Architecture Documentation](./docs/architecture/)
- [API Documentation](./docs/api/)
- [Database Schema](./packages/database/prisma/schema.prisma)
- [Shared Types](./packages/shared/src/)

---

## 🤝 Questions? | أسئلة؟

If you have questions about these rules:

1. Open an issue with the `question` label
2. Ask in discussions
3. Review existing PRs for examples

---

<div align="center">

**Thank you for contributing! | شكراً لمساهمتك!**

</div>
