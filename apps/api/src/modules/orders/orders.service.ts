import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus, OrderType, Prisma } from '@restaurant/database';

type OrderItemInput = {
  menuItemId: string;
  quantity: number;
};

type CreateOrderPayload = {
  tableId: string | number;
  items: OrderItemInput[];
};

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(payload: CreateOrderPayload) {
    if (!payload.tableId) {
      throw new BadRequestException('tableId is required');
    }

    if (!payload.items || payload.items.length === 0) {
      throw new BadRequestException('items cannot be empty');
    }

    const normalizedItems = payload.items.reduce<Record<string, number>>((acc, item) => {
      if (item.quantity <= 0) {
        throw new BadRequestException('quantity must be greater than 0');
      }
      acc[item.menuItemId] = (acc[item.menuItemId] || 0) + item.quantity;
      return acc;
    }, {});

    const menuItemIds = Object.keys(normalizedItems);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
      select: { id: true, name: true, nameAr: true, price: true, isAvailable: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      const missingIds = menuItemIds.filter((id) => !menuItems.some((item) => item.id === id));
      throw new NotFoundException(`Menu item(s) not found: ${missingIds.join(', ')}`);
    }

    for (const menuItem of menuItems) {
      if (!menuItem.isAvailable) {
        throw new ConflictException(`Menu item not available: ${menuItem.nameAr || menuItem.name}`);
      }
    }

    const orderItemsPayload = menuItems.map((menuItem) => {
      const quantity = normalizedItems[menuItem.id];
      const subtotal = Number((menuItem.price * quantity).toFixed(2));
      return {
        menuItemId: menuItem.id,
        quantity,
        price: menuItem.price,
        subtotal,
        itemSnapshot: {
          name: menuItem.name,
          nameAr: menuItem.nameAr,
        },
      };
    });

    const total = orderItemsPayload.reduce((acc, item) => acc + item.subtotal, 0);

    const tableIdValue = String(payload.tableId);
    const tableRecord = await this.prisma.table.findUnique({
      where: { id: tableIdValue },
      select: { id: true, number: true, branchId: true },
    });

    if (!tableRecord) {
      throw new NotFoundException(`Table not found: ${tableIdValue}`);
    }

    const orderData: Prisma.OrderUncheckedCreateInput = {
      tableId: tableRecord.id,
      branchId: tableRecord.branchId,
      type: OrderType.DINE_IN,
      customerName: `Table ${tableRecord.number}`,
      customerPhone: '0000000000',
      status: OrderStatus.PENDING,
      subtotal: total,
      tax: 0,
      discount: 0,
      total,
      orderNumber: `ORD-${Date.now()}`,
      items: {
        create: orderItemsPayload,
      },
    };

    const order = await this.prisma.order.create({
      data: orderData,
      select: {
        id: true,
        status: true,
        total: true,
      },
    });

    return {
      orderId: order.id,
      status: order.status,
      total: order.total,
    };
  }

  async getPublicOrderStatus(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      orderId: order.id,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
    };
  }
}
