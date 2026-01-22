# Restaurant Admin Dashboard

Admin dashboard application for the Restaurant AR Platform built with Next.js 14.

## Features

- **Dashboard**: Overview with statistics and recent activity
- **Restaurant Management**: CRUD operations for restaurants
- **Menu Management**: Manage menus and menu items
- **Order Management**: Track and update order status
- **User Management**: Manage user accounts and roles
- **File Uploads**: Support for images and 3D models
- **Authentication**: Admin and owner role-based access

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Access to the backend API

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update environment variables in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Project Structure

```
apps/admin/
├── app/
│   ├── components/        # Reusable UI components
│   ├── login/            # Login page
│   ├── restaurants/      # Restaurant management pages
│   ├── orders/           # Order management pages
│   ├── users/            # User management pages
│   ├── menu-items/       # Menu item detail pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard page
│   └── globals.css       # Global styles
├── lib/
│   ├── api.ts           # API client and methods
│   ├── auth.ts          # Authentication utilities
│   └── utils.ts         # Helper functions
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   └── useFileUpload.ts # File upload hook
└── public/              # Static assets
```

## Key Pages

- `/` - Dashboard with statistics
- `/login` - Admin login
- `/restaurants` - Restaurant list
- `/restaurants/[id]` - Restaurant detail/edit
- `/restaurants/[id]/menus` - Menu management
- `/restaurants/[id]/menus/[menuId]` - Menu detail
- `/restaurants/[id]/menus/[menuId]/items` - Menu items
- `/menu-items/[id]` - Menu item detail with asset uploads
- `/orders` - Order list
- `/orders/[id]` - Order detail
- `/users` - User management

## API Integration

The app connects to the backend API via the API client in `lib/api.ts`. All API calls include authentication tokens automatically.

## Authentication

Admin users must log in to access the dashboard. The authentication state is managed using localStorage and the `useAuth` hook.

## Development Notes

- Uses Next.js App Router (React Server Components)
- All pages marked with 'use client' for interactivity
- Tailwind CSS for styling with custom components
- Form validation and error handling included
- Responsive design for mobile and desktop
