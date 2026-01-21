import { Module } from '@nestjs/common';
import { PublicMenuController } from './menu.controller';
import { PublicMenuService } from './menu.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PublicMenuController],
  providers: [PublicMenuService, PrismaService],
  exports: [PublicMenuService],
})
export class PublicModule {}
