import { IsEnum, IsIn } from 'class-validator';
import { OrderStatus } from '@restaurant/database';

const ADMIN_ALLOWED_ORDER_STATUSES = [
  OrderStatus.ACCEPTED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.COMPLETED,
] as const;

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsIn(ADMIN_ALLOWED_ORDER_STATUSES)
  status: OrderStatus;
}
