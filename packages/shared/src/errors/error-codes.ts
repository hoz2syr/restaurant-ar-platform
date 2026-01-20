// Error Codes - Arabic and English
export const ERROR_CODES = {
  // Authentication & Authorization (1000-1099)
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_001',
    messageEn: 'Invalid email or password',
    messageAr: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
  AUTH_UNAUTHORIZED: {
    code: 'AUTH_002',
    messageEn: 'Unauthorized access',
    messageAr: 'غير مصرح بالوصول',
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_003',
    messageEn: 'Authentication token expired',
    messageAr: 'انتهت صلاحية رمز المصادقة',
  },
  AUTH_INVALID_TOKEN: {
    code: 'AUTH_004',
    messageEn: 'Invalid authentication token',
    messageAr: 'رمز مصادقة غير صالح',
  },
  AUTH_INSUFFICIENT_PERMISSIONS: {
    code: 'AUTH_005',
    messageEn: 'Insufficient permissions',
    messageAr: 'صلاحيات غير كافية',
  },

  // User Management (1100-1199)
  USER_NOT_FOUND: {
    code: 'USER_001',
    messageEn: 'User not found',
    messageAr: 'المستخدم غير موجود',
  },
  USER_EMAIL_EXISTS: {
    code: 'USER_002',
    messageEn: 'Email already exists',
    messageAr: 'البريد الإلكتروني موجود بالفعل',
  },
  USER_INACTIVE: {
    code: 'USER_003',
    messageEn: 'User account is inactive',
    messageAr: 'حساب المستخدم غير نشط',
  },

  // Menu & Categories (1200-1299)
  MENU_ITEM_NOT_FOUND: {
    code: 'MENU_001',
    messageEn: 'Menu item not found',
    messageAr: 'عنصر القائمة غير موجود',
  },
  MENU_ITEM_UNAVAILABLE: {
    code: 'MENU_002',
    messageEn: 'Menu item is currently unavailable',
    messageAr: 'عنصر القائمة غير متوفر حالياً',
  },
  CATEGORY_NOT_FOUND: {
    code: 'MENU_003',
    messageEn: 'Category not found',
    messageAr: 'التصنيف غير موجود',
  },
  MENU_ITEM_INACTIVE: {
    code: 'MENU_004',
    messageEn: 'Menu item is inactive',
    messageAr: 'عنصر القائمة غير نشط',
  },

  // Orders (1300-1399)
  ORDER_NOT_FOUND: {
    code: 'ORDER_001',
    messageEn: 'Order not found',
    messageAr: 'الطلب غير موجود',
  },
  ORDER_INVALID_STATUS: {
    code: 'ORDER_002',
    messageEn: 'Invalid order status',
    messageAr: 'حالة الطلب غير صالحة',
  },
  ORDER_CANNOT_CANCEL: {
    code: 'ORDER_003',
    messageEn: 'Order cannot be cancelled at this stage',
    messageAr: 'لا يمكن إلغاء الطلب في هذه المرحلة',
  },
  ORDER_EMPTY_CART: {
    code: 'ORDER_004',
    messageEn: 'Cart is empty',
    messageAr: 'السلة فارغة',
  },
  ORDER_MINIMUM_NOT_MET: {
    code: 'ORDER_005',
    messageEn: 'Minimum order amount not met',
    messageAr: 'الحد الأدنى لقيمة الطلب غير متوفر',
  },

  // Reservations (1400-1499)
  RESERVATION_NOT_FOUND: {
    code: 'RES_001',
    messageEn: 'Reservation not found',
    messageAr: 'الحجز غير موجود',
  },
  RESERVATION_TIME_UNAVAILABLE: {
    code: 'RES_002',
    messageEn: 'Selected time slot is not available',
    messageAr: 'الوقت المحدد غير متاح',
  },
  RESERVATION_PAST_DATE: {
    code: 'RES_003',
    messageEn: 'Cannot make reservation for past date',
    messageAr: 'لا يمكن إنشاء حجز لتاريخ سابق',
  },
  RESERVATION_TABLE_UNAVAILABLE: {
    code: 'RES_004',
    messageEn: 'No tables available for the selected party size',
    messageAr: 'لا توجد طاولات متاحة للعدد المحدد',
  },

  // Payments (1500-1599)
  PAYMENT_FAILED: {
    code: 'PAY_001',
    messageEn: 'Payment processing failed',
    messageAr: 'فشلت معالجة الدفع',
  },
  PAYMENT_NOT_FOUND: {
    code: 'PAY_002',
    messageEn: 'Payment not found',
    messageAr: 'الدفعة غير موجودة',
  },
  PAYMENT_ALREADY_PROCESSED: {
    code: 'PAY_003',
    messageEn: 'Payment already processed',
    messageAr: 'تمت معالجة الدفعة بالفعل',
  },

  // Promotions (1600-1699)
  PROMOTION_NOT_FOUND: {
    code: 'PROMO_001',
    messageEn: 'Promotion code not found',
    messageAr: 'رمز الترويج غير موجود',
  },
  PROMOTION_EXPIRED: {
    code: 'PROMO_002',
    messageEn: 'Promotion code has expired',
    messageAr: 'انتهت صلاحية رمز الترويج',
  },
  PROMOTION_LIMIT_REACHED: {
    code: 'PROMO_003',
    messageEn: 'Promotion usage limit reached',
    messageAr: 'تم الوصول إلى حد استخدام الترويج',
  },
  PROMOTION_MIN_ORDER_NOT_MET: {
    code: 'PROMO_004',
    messageEn: 'Minimum order amount not met for promotion',
    messageAr: 'الحد الأدنى لقيمة الطلب للترويج غير متوفر',
  },

  // Branch & Tables (1700-1799)
  BRANCH_NOT_FOUND: {
    code: 'BRANCH_001',
    messageEn: 'Branch not found',
    messageAr: 'الفرع غير موجود',
  },
  BRANCH_INACTIVE: {
    code: 'BRANCH_002',
    messageEn: 'Branch is inactive',
    messageAr: 'الفرع غير نشط',
  },
  TABLE_NOT_FOUND: {
    code: 'TABLE_001',
    messageEn: 'Table not found',
    messageAr: 'الطاولة غير موجودة',
  },
  TABLE_INACTIVE: {
    code: 'TABLE_002',
    messageEn: 'Table is inactive',
    messageAr: 'الطاولة غير نشطة',
  },

  // AR Features (1800-1899)
  AR_MODEL_NOT_FOUND: {
    code: 'AR_001',
    messageEn: 'AR model not found',
    messageAr: 'نموذج الواقع المعزز غير موجود',
  },
  AR_DEVICE_NOT_SUPPORTED: {
    code: 'AR_002',
    messageEn: 'AR not supported on this device',
    messageAr: 'الواقع المعزز غير مدعوم على هذا الجهاز',
  },

  // Validation Errors (1900-1999)
  VALIDATION_ERROR: {
    code: 'VAL_001',
    messageEn: 'Validation error',
    messageAr: 'خطأ في التحقق',
  },
  INVALID_INPUT: {
    code: 'VAL_002',
    messageEn: 'Invalid input data',
    messageAr: 'بيانات إدخال غير صالحة',
  },
  REQUIRED_FIELD_MISSING: {
    code: 'VAL_003',
    messageEn: 'Required field is missing',
    messageAr: 'حقل مطلوب مفقود',
  },

  // General Errors (2000-2099)
  INTERNAL_SERVER_ERROR: {
    code: 'SYS_001',
    messageEn: 'Internal server error',
    messageAr: 'خطأ داخلي في الخادم',
  },
  NOT_FOUND: {
    code: 'SYS_002',
    messageEn: 'Resource not found',
    messageAr: 'المورد غير موجود',
  },
  BAD_REQUEST: {
    code: 'SYS_003',
    messageEn: 'Bad request',
    messageAr: 'طلب غير صالح',
  },
  SERVICE_UNAVAILABLE: {
    code: 'SYS_004',
    messageEn: 'Service temporarily unavailable',
    messageAr: 'الخدمة غير متاحة مؤقتاً',
  },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export function getErrorMessage(
  errorCode: ErrorCode,
  language: 'en' | 'ar' = 'ar'
): string {
  const error = ERROR_CODES[errorCode];
  return language === 'ar' ? error.messageAr : error.messageEn;
}
