import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.menu.findMany({
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        restaurant: true,
        items: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.menu.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async create(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: createMenuDto,
      include: {
        restaurant: true,
      },
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
      include: {
        restaurant: true,
      },
    });
  }

  async remove(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    await this.prisma.menu.delete({
      where: { id },
    });

    return { message: 'Menu deleted successfully' };
  }
}
