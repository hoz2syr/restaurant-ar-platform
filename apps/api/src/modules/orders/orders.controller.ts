import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('public/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body()
    body: {
      tableId: string | number;
      items: { menuItemId: string; quantity: number }[];
    },
  ) {
    return this.ordersService.createOrder(body);
  }

  @Get(':id')
  async getPublicOrderStatus(@Param('id') orderId: string) {
    return this.ordersService.getPublicOrderStatus(orderId);
  }
}
