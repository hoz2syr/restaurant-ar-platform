import { Module } from '@nestjs/common';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
import { PrismaService } from '../../shared/prisma.service';

@Module({
  controllers: [MenuItemsController],
  providers: [MenuItemsService, PrismaService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
