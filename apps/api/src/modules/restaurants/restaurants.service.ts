import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.restaurant.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        menus: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async create(createRestaurantDto: CreateRestaurantDto, ownerId: string) {
    return this.prisma.restaurant.create({
      data: {
        ...createRestaurantDto,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
    userId: string,
    userRole: string,
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    if (userRole !== 'ADMIN' && restaurant.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to update this restaurant');
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    if (userRole !== 'ADMIN' && restaurant.ownerId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this restaurant');
    }

    await this.prisma.restaurant.delete({
      where: { id },
    });

    return { message: 'Restaurant deleted successfully' };
  }

  async findByOwner(ownerId: string) {
    return this.prisma.restaurant.findMany({
      where: { ownerId },
      include: {
        menus: true,
      },
    });
  }
}
