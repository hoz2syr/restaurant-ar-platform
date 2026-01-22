# Quick Start Guide

## 🚀 Running the Admin Dashboard

### Development Mode
```bash
cd apps/admin
npm install
npm run dev
```
Access at: http://localhost:3001

### Production Build
```bash
npm run build
npm start
```

## 🔑 Default Login Credentials
Configure your backend to accept:
- Email: `admin@example.com`
- Password: `admin123`

## 📱 Page Navigation

### Main Pages
- **Dashboard** → `/` - Overview and statistics
- **Restaurants** → `/restaurants` - Manage all restaurants
- **Orders** → `/orders` - View and manage orders
- **Users** → `/users` - User management

### Restaurant Management Flow
1. Go to `/restaurants`
2. Click "Add Restaurant" to create new
3. Click on a restaurant to edit details
4. Click "Manage Menus" to add menus

### Menu Management Flow
1. From restaurant detail, click "Manage Menus"
2. Click "Add Menu" to create new menu
3. Click "Items" to add menu items
4. Click on item to edit and upload images/3D models

### Order Management
1. Go to `/orders`
2. Filter by status (pending, confirmed, etc.)
3. Click on order to view details
4. Update status from dropdown

### User Management
1. Go to `/users`
2. Filter by role (admin, owner, customer)
3. Change status (active, inactive, suspended)

## 🎨 Component Usage Examples

### Using the Modal Component
```tsx
import Modal from '@/app/components/Modal';

<Modal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)} 
  title="Add Item"
  size="lg"
>
  <form>...</form>
</Modal>
```

### Using the FileUploader
```tsx
import FileUploader from '@/app/components/FileUploader';

<FileUploader
  onUploadComplete={(url) => console.log(url)}
  accept="image/*"
  label="Upload Image"
  description="Select an image file"
/>
```

### Using Form Components
```tsx
import Input from '@/app/components/Input';
import TextArea from '@/app/components/TextArea';
import Select from '@/app/components/Select';

<Input
  label="Name"
  required
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<TextArea
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

<Select
  label="Status"
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
/>
```

## 🔌 API Integration

The app expects these API endpoints:

### Authentication
- `POST /admin/auth/login` - Admin login

### Restaurants
- `GET /admin/restaurants` - List all
- `GET /admin/restaurants/:id` - Get one
- `POST /admin/restaurants` - Create
- `PUT /admin/restaurants/:id` - Update
- `DELETE /admin/restaurants/:id` - Delete

### Menus
- `GET /admin/restaurants/:id/menus` - List menus
- `GET /admin/menus/:id` - Get menu
- `POST /admin/restaurants/:id/menus` - Create menu
- `PUT /admin/menus/:id` - Update menu
- `DELETE /admin/menus/:id` - Delete menu

### Menu Items
- `GET /admin/menus/:id/items` - List items
- `GET /admin/menu-items/:id` - Get item
- `POST /admin/menus/:id/items` - Create item
- `PUT /admin/menu-items/:id` - Update item
- `DELETE /admin/menu-items/:id` - Delete item
- `POST /admin/menu-items/:id/image` - Upload image
- `POST /admin/menu-items/:id/model` - Upload 3D model

### Orders
- `GET /admin/orders` - List orders
- `GET /admin/orders/:id` - Get order
- `PATCH /admin/orders/:id/status` - Update status

### Users
- `GET /admin/users` - List users
- `GET /admin/users/:id` - Get user
- `PUT /admin/users/:id` - Update user
- `PATCH /admin/users/:id/status` - Update status

### Dashboard
- `GET /admin/dashboard/stats` - Get statistics

## 🎯 Key Features

### 1. Search and Filter
- Restaurant search by name/address
- Order filtering by status
- User filtering by role and status

### 2. Status Management
- Update order status via dropdown
- Update user status inline
- Restaurant status badges

### 3. File Uploads
- Drag and drop support
- Progress tracking
- File size validation
- Support for images and 3D models

### 4. Form Validation
- Required field indicators
- Error messages
- Client-side validation

### 5. Responsive Design
- Works on desktop, tablet, mobile
- Collapsible sidebar (can be added)
- Touch-friendly controls

## 🛠️ Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: { /* your colors */ },
  admin: {
    sidebar: '#1e293b',
    hover: '#334155',
    active: '#0ea5e9',
  },
}
```

### Add New Page
1. Create `app/your-page/page.tsx`
2. Add route to `Sidebar.tsx`
3. Create API methods in `lib/api.ts`

### Add New Component
Create in `app/components/YourComponent.tsx`:
```tsx
'use client';

export default function YourComponent() {
  return <div>Your component</div>;
}
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors
```bash
# Run type check
npm run type-check
```

### Lint Errors
```bash
# Run linter
npm run lint
```

## 📚 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather)
- **HTTP Client**: Axios
- **State**: React Hooks
- **Forms**: Native React

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Icons](https://react-icons.github.io/react-icons)
- [TypeScript](https://www.typescriptlang.org)
