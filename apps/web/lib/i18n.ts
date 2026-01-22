export type Locale = 'en' | 'ar';

export interface Translation {
  [key: string]: string | Translation;
}

const translations: Record<Locale, Translation> = {
  en: {
    nav: {
      home: 'Home',
      restaurants: 'Restaurants',
      cart: 'Cart',
      orders: 'Orders',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
    home: {
      title: 'Discover Amazing Restaurants',
      subtitle: 'Explore menus in 3D with AR technology',
      searchPlaceholder: 'Search for restaurants...',
    },
    restaurant: {
      menus: 'Menus',
      viewMenu: 'View Menu',
      noMenus: 'No menus available',
      rating: 'Rating',
      deliveryTime: 'Delivery Time',
      minimumOrder: 'Minimum Order',
    },
    menu: {
      items: 'Items',
      viewIn3D: 'View in 3D',
      addToCart: 'Add to Cart',
      price: 'Price',
      description: 'Description',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
    },
    orders: {
      title: 'Order History',
      noOrders: 'No orders yet',
      status: 'Status',
      date: 'Date',
      viewDetails: 'View Details',
    },
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Register',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      submit: 'Submit',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      restaurants: 'المطاعم',
      cart: 'السلة',
      orders: 'الطلبات',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
    },
    home: {
      title: 'اكتشف مطاعم رائعة',
      subtitle: 'استكشف القوائم بتقنية الواقع المعزز ثلاثي الأبعاد',
      searchPlaceholder: 'ابحث عن المطاعم...',
    },
    restaurant: {
      menus: 'القوائم',
      viewMenu: 'عرض القائمة',
      noMenus: 'لا توجد قوائم متاحة',
      rating: 'التقييم',
      deliveryTime: 'وقت التوصيل',
      minimumOrder: 'الحد الأدنى للطلب',
    },
    menu: {
      items: 'العناصر',
      viewIn3D: 'عرض ثلاثي الأبعاد',
      addToCart: 'أضف إلى السلة',
      price: 'السعر',
      description: 'الوصف',
    },
    cart: {
      title: 'سلة التسوق',
      empty: 'سلتك فارغة',
      total: 'المجموع',
      checkout: 'إتمام الطلب',
      remove: 'إزالة',
      quantity: 'الكمية',
    },
    orders: {
      title: 'سجل الطلبات',
      noOrders: 'لا توجد طلبات بعد',
      status: 'الحالة',
      date: 'التاريخ',
      viewDetails: 'عرض التفاصيل',
    },
    auth: {
      loginTitle: 'تسجيل الدخول',
      registerTitle: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      name: 'الاسم',
      phone: 'الهاتف',
      submit: 'إرسال',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
    },
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      retry: 'إعادة المحاولة',
      back: 'رجوع',
      save: 'حفظ',
      cancel: 'إلغاء',
    },
  },
};

export const getTranslation = (locale: Locale, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
};

export const isRTL = (locale: Locale): boolean => locale === 'ar';

export const getDirection = (locale: Locale): 'rtl' | 'ltr' =>
  isRTL(locale) ? 'rtl' : 'ltr';
