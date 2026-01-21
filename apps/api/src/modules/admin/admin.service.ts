/**
 * AdminService: Provides read-only admin statistics and lists from the database.
 */
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@restaurant/database';

const ORDER_STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.PENDING]: OrderStatus.ACCEPTED,
  [OrderStatus.ACCEPTED]: OrderStatus.PREPARING,
  [OrderStatus.PREPARING]: OrderStatus.READY,
  [OrderStatus.READY]: OrderStatus.COMPLETED,
};

type AdminOrderItemSnapshot = {
  name: string;
  nameAr?: string;
};

type AdminOrderItem = {
  id: string;
  quantity: number;
  price: number;
  subtotal: number;
  notes: string | null;
  itemSnapshot: AdminOrderItemSnapshot;
};

type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  tableId: string | null;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  items: AdminOrderItem[];
};

type AdminOrderStatusUpdateResult = {
  id: string;
  status: OrderStatus;
  updatedAt: Date;
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeOptionalString(value?: string): string | null | undefined {
    if (value === undefined) return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }

  private resolveArPayload(input: {
    hasArModel?: boolean;
    arModelUrl?: string;
    arModelUrlIos?: string;
    arModelUrlAndroid?: string;
    arThumbnail?: string;
  }) {
    const arModelUrl = this.normalizeOptionalString(input.arModelUrl);
    const arModelUrlIos = this.normalizeOptionalString(input.arModelUrlIos);
    const arModelUrlAndroid = this.normalizeOptionalString(input.arModelUrlAndroid);
    const arThumbnail = this.normalizeOptionalString(input.arThumbnail);
    const hasAnyModelUrl = Boolean(arModelUrl || arModelUrlIos || arModelUrlAndroid);

    let hasArModel = input.hasArModel;
    if (hasArModel === undefined && hasAnyModelUrl) {
      hasArModel = true;
    }

    if (hasArModel === true && !hasAnyModelUrl) {
      throw new BadRequestException('AR model enabled but no model URLs provided');
    }

    if (hasArModel === false && hasAnyModelUrl) {
      throw new BadRequestException('Disable AR requires clearing AR model URLs');
    }

    return {
      hasArModel,
      arModelUrl,
      arModelUrlIos,
      arModelUrlAndroid,
      arThumbnail,
    };
  }

  async getStats() {
    const [ordersCount, menuItemsCount, reservationsCount, usersCount] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.menuItem.count(),
        this.prisma.reservation.count(),
        this.prisma.user.count(),
      ]);

    return {
      ordersCount,
      menuItemsCount,
      reservationsCount,
      usersCount,
    };
  }

  async getOrders(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          type: true,
          status: true,
          customerName: true,
          total: true,
          createdAt: true,
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      data: orders,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async getOrderById(id: string): Promise<AdminOrderDetail> {
    const order = (await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        tableId: true,
        status: true,
        total: true,
        createdAt: true,
        items: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            quantity: true,
            price: true,
            subtotal: true,
            notes: true,
            itemSnapshot: true,
          },
        },
      },
    })) as AdminOrderDetail | null;

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<AdminOrderStatusUpdateResult> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const expectedNext = ORDER_STATUS_TRANSITIONS[order.status];
    if (expectedNext !== status) {
      throw new ConflictException('Invalid status transition');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async getMenuItems(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          nameAr: true,
          price: true,
          isAvailable: true,
          hasArModel: true,
          category: { select: { name: true, nameAr: true } },
          createdAt: true,
        },
      }),
      this.prisma.menuItem.count(),
    ]);

    return {
      data: items,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async getUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // ==================== Menu Items CRUD ====================

  async getCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, nameAr: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getMenuItemById(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, nameAr: true } } },
    });
  }

  async createMenuItem(data: {
    name: string;
    nameAr: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    preparationTime: number;
    calories?: number;
    categoryId: string;
    isAvailable?: boolean;
    hasArModel?: boolean;
    arModelUrl?: string;
    arModelUrlIos?: string;
    arModelUrlAndroid?: string;
    arThumbnail?: string;
  }) {
    const arData = this.resolveArPayload(data);
    return this.prisma.menuItem.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        price: data.price,
        preparationTime: data.preparationTime,
        calories: data.calories,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable ?? true,
        hasArModel: arData.hasArModel ?? false,
        arModelUrl: arData.arModelUrl ?? null,
        arModelUrlIos: arData.arModelUrlIos ?? null,
        arModelUrlAndroid: arData.arModelUrlAndroid ?? null,
        arThumbnail: arData.arThumbnail ?? null,
      },
      include: { category: { select: { id: true, name: true, nameAr: true } } },
    });
  }

  async updateMenuItem(
    id: string,
    data: {
      name?: string;
      nameAr?: string;
      description?: string;
      descriptionAr?: string;
      price?: number;
      preparationTime?: number;
      calories?: number;
      categoryId?: string;
      isAvailable?: boolean;
      hasArModel?: boolean;
      arModelUrl?: string;
      arModelUrlIos?: string;
      arModelUrlAndroid?: string;
      arThumbnail?: string;
    },
  ) {
    const arInput = {
      hasArModel: data.hasArModel,
      arModelUrl: data.arModelUrl,
      arModelUrlIos: data.arModelUrlIos,
      arModelUrlAndroid: data.arModelUrlAndroid,
      arThumbnail: data.arThumbnail,
    };

    const arProvided = Object.values(arInput).some((value) => value !== undefined);
    const arUpdate = arProvided ? this.resolveArPayload(arInput) : null;
    const updateData = {
      ...data,
      ...(arUpdate?.hasArModel !== undefined ? { hasArModel: arUpdate.hasArModel } : {}),
      ...(arUpdate?.arModelUrl !== undefined ? { arModelUrl: arUpdate.arModelUrl } : {}),
      ...(arUpdate?.arModelUrlIos !== undefined ? { arModelUrlIos: arUpdate.arModelUrlIos } : {}),
      ...(arUpdate?.arModelUrlAndroid !== undefined ? { arModelUrlAndroid: arUpdate.arModelUrlAndroid } : {}),
      ...(arUpdate?.arThumbnail !== undefined ? { arThumbnail: arUpdate.arThumbnail } : {}),
    };

    return this.prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: { category: { select: { id: true, name: true, nameAr: true } } },
    });
  }

  async deleteMenuItem(id: string) {
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
