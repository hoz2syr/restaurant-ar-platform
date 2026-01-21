import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type ArMenuItemResponse = {
  hasArModel: boolean;
  arModelUrl: string | null;
  arModelUrlIos: string | null;
  arModelUrlAndroid: string | null;
  arThumbnail: string | null;
};

type ArReadinessResponse = {
  isReady: boolean;
  supportedFormats: string[];
  reason?: string;
  modelUrl?: string;
  thumbnailUrl?: string;
};

@Injectable()
export class PublicMenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getMenuItems(page = 1, limit = 10) {
    const take = Math.max(1, Math.min(limit, 50));
    const skip = (page - 1) * take;

    const [items, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          nameAr: true,
          description: true,
          descriptionAr: true,
          price: true,
          preparationTime: true,
          isAvailable: true,
          hasArModel: true,
          arThumbnail: true,
          category: { select: { id: true, name: true, nameAr: true } },
          createdAt: true,
        },
      }),
      this.prisma.menuItem.count({ where: { isActive: true, isAvailable: true } }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit: take,
        pages: Math.max(1, Math.ceil(total / take)),
      },
    };
  }

  async getMenuItemById(id: string) {
    return this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, nameAr: true } },
      },
    });
  }

  async getCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, nameAr: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getMenuItemArInfo(id: string): Promise<ArMenuItemResponse> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      select: {
        hasArModel: true,
        arModelUrl: true,
        arModelUrlIos: true,
        arModelUrlAndroid: true,
        arThumbnail: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    return {
      hasArModel: item.hasArModel,
      arModelUrl: item.arModelUrl,
      arModelUrlIos: item.arModelUrlIos,
      arModelUrlAndroid: item.arModelUrlAndroid,
      arThumbnail: item.arThumbnail,
    };
  }

  async getMenuItemArReadiness(id: string, userAgent?: string): Promise<ArReadinessResponse> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      select: {
        hasArModel: true,
        arModelUrl: true,
        arModelUrlIos: true,
        arModelUrlAndroid: true,
        arThumbnail: true,
      },
    });

    if (!item || !item.hasArModel) {
      return {
        isReady: false,
        supportedFormats: [],
        reason: 'No AR model available',
      };
    }

    const isIOS = userAgent?.includes('iPhone') || userAgent?.includes('iPad') || userAgent?.includes('iPod');
    const isAndroid = userAgent?.includes('Android');

    let modelUrl: string | null = null;
    const supportedFormats: string[] = [];

    if (isIOS && item.arModelUrlIos) {
      modelUrl = item.arModelUrlIos;
      supportedFormats.push('USDZ');
    } else if (isAndroid && item.arModelUrlAndroid) {
      modelUrl = item.arModelUrlAndroid;
      supportedFormats.push('GLB');
    } else if (item.arModelUrl) {
      modelUrl = item.arModelUrl;
      supportedFormats.push('GLB', 'USDZ');
    }

    if (!modelUrl) {
      return {
        isReady: false,
        supportedFormats: [],
        reason: 'No compatible AR model for this device',
      };
    }

    // Check model size (25MB limit)
    try {
      const response = await fetch(modelUrl, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeMB = parseInt(contentLength, 10) / (1024 * 1024);
        if (sizeMB > 25) {
          return {
            isReady: false,
            supportedFormats,
            reason: 'AR model exceeds size limit (25MB)',
          };
        }
      }
    } catch (error) {
      // If we can't check size, assume it's okay (fail open)
    }

    return {
      isReady: true,
      supportedFormats,
      modelUrl,
      thumbnailUrl: item.arThumbnail || undefined,
    };
  }
}
