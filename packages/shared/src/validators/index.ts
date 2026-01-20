import { z } from 'zod';

// Order Validation Schemas
export const createOrderItemSchema = z.object({
  menuItemId: z.string().cuid(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const createOrderSchema = z.object({
  type: z.enum(['DINE_IN', 'TAKEAWAY', 'DELIVERY']),
  branchId: z.string().cuid(),
  tableId: z.string().cuid().optional(),
  customerId: z.string().cuid().optional(),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(/^\+?[0-9]{10,15}$/),
  customerEmail: z.string().email().optional(),
  deliveryAddressId: z.string().cuid().optional(),
  deliveryNotes: z.string().max(500).optional(),
  items: z.array(createOrderItemSchema).min(1),
  promotionCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'IN_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ]),
  notes: z.string().max(500).optional(),
});

// Reservation Validation Schemas
export const createReservationSchema = z.object({
  branchId: z.string().cuid(),
  date: z.string().datetime(),
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/), // HH:mm format
  partySize: z.number().int().min(1).max(20),
  customerId: z.string().cuid().optional(),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(/^\+?[0-9]{10,15}$/),
  customerEmail: z.string().email().optional(),
  notes: z.string().max(500).optional(),
});

export const updateReservationStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'SEATED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
  ]),
  tableId: z.string().cuid().optional(),
  notes: z.string().max(500).optional(),
});

// Menu Item Validation Schemas
export const createMenuItemSchema = z.object({
  name: z.string().min(2).max(100),
  nameAr: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  descriptionAr: z.string().max(500).optional(),
  price: z.number().positive(),
  preparationTime: z.number().int().positive(),
  calories: z.number().int().positive().optional(),
  categoryId: z.string().cuid(),
  image: z.string().url().optional(),
  imageAr: z.string().url().optional(),
  hasArModel: z.boolean().default(false),
  arModelUrl: z.string().url().optional(),
  arModelUrlIos: z.string().url().optional(),
  arModelUrlAndroid: z.string().url().optional(),
  arThumbnail: z.string().url().optional(),
  tagIds: z.array(z.string().cuid()).optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

// Payment Validation Schema
export const createPaymentSchema = z.object({
  orderId: z.string().cuid(),
  amount: z.number().positive(),
  method: z.enum(['CASH', 'CARD', 'ONLINE', 'WALLET']),
  transactionId: z.string().optional(),
  paymentDetails: z.record(z.any()).optional(),
});

// Customer Validation Schemas
export const createCustomerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  name: z.string().min(2).max(100),
  dateOfBirth: z.string().datetime().optional(),
  preferredLanguage: z.enum(['ar', 'en']).default('ar'),
});

export const createCustomerAddressSchema = z.object({
  customerId: z.string().cuid(),
  label: z.string().min(2).max(50),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(50),
  area: z.string().max(50).optional(),
  building: z.string().max(50).optional(),
  floor: z.string().max(20).optional(),
  apartment: z.string().max(20).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().default(false),
});

// Promotion Validation Schema
export const applyPromotionSchema = z.object({
  promotionCode: z.string().min(3).max(20),
  orderTotal: z.number().positive(),
});

// Types from schemas
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationStatusInput = z.infer<
  typeof updateReservationStatusSchema
>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type CreateCustomerAddressInput = z.infer<
  typeof createCustomerAddressSchema
>;
export type ApplyPromotionInput = z.infer<typeof applyPromotionSchema>;
