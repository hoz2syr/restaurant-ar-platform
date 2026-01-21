/**
 * AdminController: Exposes admin endpoints (read + CRUD for menu items).
 * All routes are protected by JwtAuthGuard.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('orders')
  async getOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getOrders(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.adminService.getOrderById(id);
  }

  @Get('menu')
  async getMenuItems(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getMenuItems(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto.status);
  }

  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  // ==================== Menu Items CRUD ====================

  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Get('menu/:id')
  async getMenuItem(@Param('id') id: string) {
    const item = await this.adminService.getMenuItemById(id);
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  @Post('menu')
  async createMenuItem(@Body() dto: CreateMenuItemDto) {
    return this.adminService.createMenuItem(dto);
  }

  @Put('menu/:id')
  async updateMenuItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    const existing = await this.adminService.getMenuItemById(id);
    if (!existing) throw new NotFoundException('Menu item not found');
    return this.adminService.updateMenuItem(id, dto);
  }

  @Delete('menu/:id')
  async deleteMenuItem(@Param('id') id: string) {
    const existing = await this.adminService.getMenuItemById(id);
    if (!existing) throw new NotFoundException('Menu item not found');
    await this.adminService.deleteMenuItem(id);
    return { success: true };
  }
}
