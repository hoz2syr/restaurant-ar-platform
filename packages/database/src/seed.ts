import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Tags
  console.log('📋 Creating tags...');
  
  // Allergen Tags
  const allergenTags = [
    { name: 'gluten', nameAr: 'جلوتين', type: 'allergen', icon: '🌾', color: '#FFA726' },
    { name: 'dairy', nameAr: 'منتجات الألبان', type: 'allergen', icon: '🥛', color: '#64B5F6' },
    { name: 'nuts', nameAr: 'مكسرات', type: 'allergen', icon: '🥜', color: '#A1887F' },
    { name: 'shellfish', nameAr: 'قشريات', type: 'allergen', icon: '🦐', color: '#EF5350' },
    { name: 'eggs', nameAr: 'بيض', type: 'allergen', icon: '🥚', color: '#FFD54F' },
    { name: 'soy', nameAr: 'صويا', type: 'allergen', icon: '🫘', color: '#81C784' },
  ];

  // Dietary Tags
  const dietaryTags = [
    { name: 'vegetarian', nameAr: 'نباتي', type: 'dietary', icon: '🥗', color: '#66BB6A' },
    { name: 'vegan', nameAr: 'نباتي صرف', type: 'dietary', icon: '🌱', color: '#4CAF50' },
    { name: 'halal', nameAr: 'حلال', type: 'dietary', icon: '☪️', color: '#26A69A' },
    { name: 'keto', nameAr: 'كيتو', type: 'dietary', icon: '🥑', color: '#AB47BC' },
    { name: 'low-carb', nameAr: 'قليل الكربوهيدرات', type: 'dietary', icon: '📉', color: '#7E57C2' },
  ];

  // Feature Tags
  const featureTags = [
    { name: 'spicy', nameAr: 'حار', type: 'feature', icon: '🌶️', color: '#F44336' },
    { name: 'popular', nameAr: 'شائع', type: 'feature', icon: '⭐', color: '#FFC107' },
    { name: 'chef-special', nameAr: 'اختيار الشيف', type: 'feature', icon: '👨‍🍳', color: '#FF6F00' },
    { name: 'new', nameAr: 'جديد', type: 'feature', icon: '✨', color: '#00BCD4' },
    { name: 'seasonal', nameAr: 'موسمي', type: 'feature', icon: '🍂', color: '#FF9800' },
  ];

  const allTags = [...allergenTags, ...dietaryTags, ...featureTags];

  for (const tag of allTags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  console.log(`✅ Created ${allTags.length} tags`);

  // Create Main Branch
  console.log('🏢 Creating main branch...');
  
  const mainBranch = await prisma.branch.upsert({
    where: { id: 'main-branch-001' },
    update: {},
    create: {
      id: 'main-branch-001',
      name: 'Main Branch',
      nameAr: 'الفرع الرئيسي',
      address: '123 Restaurant Street, Downtown',
      addressAr: '١٢٣ شارع المطاعم، وسط المدينة',
      city: 'Riyadh',
      cityAr: 'الرياض',
      phone: '+966501234567',
      email: 'main@restaurant.com',
      isActive: true,
      latitude: 24.7136,
      longitude: 46.6753,
      operatingHours: {
        sunday: { open: '10:00', close: '23:00', closed: false },
        monday: { open: '10:00', close: '23:00', closed: false },
        tuesday: { open: '10:00', close: '23:00', closed: false },
        wednesday: { open: '10:00', close: '23:00', closed: false },
        thursday: { open: '10:00', close: '00:00', closed: false },
        friday: { open: '13:00', close: '00:00', closed: false },
        saturday: { open: '10:00', close: '00:00', closed: false },
      },
    },
  });

  console.log('✅ Created main branch');

  // Create Tables for Main Branch
  console.log('🪑 Creating tables...');
  
  const tablesToCreate = [
    { number: '1', seats: 2, qrCode: 'QR-TABLE-001' },
    { number: '2', seats: 2, qrCode: 'QR-TABLE-002' },
    { number: '3', seats: 4, qrCode: 'QR-TABLE-003' },
    { number: '4', seats: 4, qrCode: 'QR-TABLE-004' },
    { number: '5', seats: 6, qrCode: 'QR-TABLE-005' },
    { number: '6', seats: 6, qrCode: 'QR-TABLE-006' },
    { number: '7', seats: 8, qrCode: 'QR-TABLE-007' },
    { number: '8', seats: 8, qrCode: 'QR-TABLE-008' },
  ];

  for (const table of tablesToCreate) {
    await prisma.table.upsert({
      where: { qrCode: table.qrCode },
      update: {},
      create: {
        ...table,
        branchId: mainBranch.id,
      },
    });
  }

  console.log(`✅ Created ${tablesToCreate.length} tables`);

  // Create Menu Categories
  console.log('📂 Creating menu categories...');
  
  const categories = [
    {
      id: 'cat-appetizers',
      name: 'Appetizers',
      nameAr: 'المقبلات',
      description: 'Start your meal with our delicious appetizers',
      descriptionAr: 'ابدأ وجبتك بمقبلاتنا الشهية',
      sortOrder: 1,
    },
    {
      id: 'cat-main-courses',
      name: 'Main Courses',
      nameAr: 'الأطباق الرئيسية',
      description: 'Our signature main dishes',
      descriptionAr: 'أطباقنا الرئيسية المميزة',
      sortOrder: 2,
    },
    {
      id: 'cat-desserts',
      name: 'Desserts',
      nameAr: 'الحلويات',
      description: 'Sweet endings to your meal',
      descriptionAr: 'نهاية حلوة لوجبتك',
      sortOrder: 3,
    },
    {
      id: 'cat-beverages',
      name: 'Beverages',
      nameAr: 'المشروبات',
      description: 'Refresh yourself with our drinks',
      descriptionAr: 'انعش نفسك بمشروباتنا',
      sortOrder: 4,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  console.log(`✅ Created ${categories.length} categories`);

  // Create Admin User
  console.log('👤 Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password: hashedPassword,
      name: 'System Administrator',
      phone: '+966501234567',
      role: 'SUPER_ADMIN',
      isActive: true,
      branchId: mainBranch.id,
    },
  });

  console.log('✅ Created admin user (email: admin@restaurant.com, password: admin123)');

  // Create Sample Menu Items
  console.log('🍽️ Creating sample menu items...');
  
  const sampleMenuItems = [
    {
      name: 'Hummus Bowl',
      nameAr: 'طبق الحمص',
      description: 'Traditional chickpea dip with tahini and olive oil',
      descriptionAr: 'غموس الحمص التقليدي مع الطحينة وزيت الزيتون',
      price: 25.00,
      preparationTime: 5,
      calories: 180,
      categoryId: 'cat-appetizers',
      hasArModel: true,
      arModelUrl: 'https://cdn.example.com/models/hummus.glb',
      isAvailable: true,
    },
    {
      name: 'Grilled Chicken',
      nameAr: 'دجاج مشوي',
      description: 'Tender grilled chicken with herbs and spices',
      descriptionAr: 'دجاج مشوي طري مع الأعشاب والتوابل',
      price: 65.00,
      preparationTime: 20,
      calories: 450,
      categoryId: 'cat-main-courses',
      hasArModel: true,
      arModelUrl: 'https://cdn.example.com/models/chicken.glb',
      isAvailable: true,
    },
    {
      name: 'Kunafa',
      nameAr: 'كنافة',
      description: 'Sweet cheese pastry soaked in syrup',
      descriptionAr: 'معجنات الجبن الحلوة المنقوعة في الشراب',
      price: 30.00,
      preparationTime: 10,
      calories: 350,
      categoryId: 'cat-desserts',
      hasArModel: false,
      isAvailable: true,
    },
    {
      name: 'Fresh Orange Juice',
      nameAr: 'عصير برتقال طازج',
      description: 'Freshly squeezed orange juice',
      descriptionAr: 'عصير برتقال طازج معصور',
      price: 15.00,
      preparationTime: 3,
      calories: 120,
      categoryId: 'cat-beverages',
      hasArModel: false,
      isAvailable: true,
    },
  ];

  for (const item of sampleMenuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  console.log(`✅ Created ${sampleMenuItems.length} sample menu items`);

  console.log('');
  console.log('✨ Database seeding completed successfully!');
  console.log('');
  console.log('📝 Admin Credentials:');
  console.log('   Email: admin@restaurant.com');
  console.log('   Password: admin123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
