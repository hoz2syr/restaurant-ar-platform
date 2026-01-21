import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)} ر.س`;
}

export function formatPriceEn(price: number): string {
  return `SAR ${price.toFixed(2)}`;
}

export function getStatusLabel(status: string): { label: string; labelAr: string; color: string } {
  const statusMap: Record<string, { label: string; labelAr: string; color: string }> = {
    PENDING: { label: 'Pending', labelAr: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
    ACCEPTED: { label: 'Accepted', labelAr: 'مقبول', color: 'bg-blue-100 text-blue-800' },
    PREPARING: { label: 'Preparing', labelAr: 'جاري التحضير', color: 'bg-purple-100 text-purple-800' },
    READY: { label: 'Ready', labelAr: 'جاهز', color: 'bg-green-100 text-green-800' },
    COMPLETED: { label: 'Completed', labelAr: 'مكتمل', color: 'bg-gray-100 text-gray-800' },
    CANCELLED: { label: 'Cancelled', labelAr: 'ملغي', color: 'bg-red-100 text-red-800' },
  };
  return statusMap[status] || { label: status, labelAr: status, color: 'bg-gray-100 text-gray-800' };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
