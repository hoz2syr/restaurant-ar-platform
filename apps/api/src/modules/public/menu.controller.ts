import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { PublicMenuService } from './menu.service';

@Controller('public/menu')
export class PublicMenuController {
  constructor(private readonly publicMenuService: PublicMenuService) {}

  @Get()
  async getMenuItems(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? Number.parseInt(page, 10) : 1;
    const limitNumber = limit ? Number.parseInt(limit, 10) : 10;
    return this.publicMenuService.getMenuItems(pageNumber, limitNumber);
  }

  @Get('categories')
  async getCategories() {
    return this.publicMenuService.getCategories();
  }

  @Get(':id')
  async getMenuItem(@Param('id') id: string) {
    return this.publicMenuService.getMenuItemById(id);
  }

  @Get(':id/ar')
  async getMenuItemAr(@Param('id') id: string) {
    return this.publicMenuService.getMenuItemArInfo(id);
  }

  @Get(':id/ar/readiness')
  async getMenuItemArReadiness(
    @Param('id') id: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.publicMenuService.getMenuItemArReadiness(id, userAgent);
  }
}
