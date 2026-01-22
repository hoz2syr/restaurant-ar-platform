# Restaurant AR Platform - Web App

A Next.js-based customer-facing web application for the Restaurant AR Platform with 3D menu visualization and AR capabilities.

## Features

- 🌐 Multi-language support (English/Arabic with RTL)
- 🎨 Modern, responsive UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Mobile-first design
- 🥘 Restaurant browsing and search
- 📋 Menu exploration with categories
- 🔮 AR viewer for 3D menu items using @google/model-viewer
- 🛒 Shopping cart functionality with Zustand
- 👤 User authentication
- 📦 Order history
- ⚡ Built with Next.js 14 App Router

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **3D/AR**: @google/model-viewer
- **UI Components**: Custom React components

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local with your API URL
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Project Structure

```
apps/web/
├── app/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── MenuCard.tsx
│   │   ├── MenuItemCard.tsx
│   │   ├── ARViewer.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderCard.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── restaurants/         # Restaurant pages
│   │   ├── page.tsx        # List all restaurants
│   │   └── [id]/
│   │       ├── page.tsx    # Restaurant details
│   │       └── menu/[menuId]/
│   │           └── page.tsx # Menu items
│   ├── menu-items/[id]/    # Menu item detail with AR
│   ├── cart/               # Shopping cart
│   ├── orders/             # Order history
│   ├── auth/               # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useLanguage.ts
├── lib/                    # Utility functions
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth utilities
│   └── i18n.ts            # Internationalization
├── public/                # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Key Features

### Multi-language Support

The app supports English and Arabic with full RTL (Right-to-Left) layout support:

```typescript
import { useLanguage } from '@/hooks/useLanguage';

const { locale, setLocale, t, direction } = useLanguage();
```

### AR Viewer

View 3D models of menu items with AR capabilities:

```typescript
import ARViewer from '@/app/components/ARViewer';

<ARViewer 
  modelUrl="/models/dish.glb" 
  poster="/images/dish.jpg"
  alt="Dish name"
/>
```

### State Management

Shopping cart uses Zustand for state management:

```typescript
import { useCart } from '@/hooks/useCart';

const { items, addItem, removeItem, getTotal } = useCart();
```

### API Integration

All API calls are centralized in `lib/api.ts`:

```typescript
import { restaurantsAPI, menusAPI, ordersAPI } from '@/lib/api';
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Use Tailwind CSS utility classes
- Implement responsive design (mobile-first)
- Add proper error handling and loading states
- Include i18n translations for new strings
- Test on both LTR and RTL layouts

## License

Copyright © 2024 Restaurant AR Platform
