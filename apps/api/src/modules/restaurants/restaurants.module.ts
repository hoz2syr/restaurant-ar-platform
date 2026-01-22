import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { PrismaService } from '../../shared/prisma.service';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, PrismaService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
