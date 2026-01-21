import type { Metadata } from 'next';
import MenuItemClient from './MenuItemClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

async function fetchMenuItemMeta(id: string) {
  try {
    const res = await fetch(`${API_BASE}/public/menu/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await fetchMenuItemMeta(params.id);
  const item = data?.data || data;
  const title = item?.nameAr || item?.name || 'تفاصيل الطبق';
  const description = item?.descriptionAr || item?.description || 'تعرف على تفاصيل الطبق قبل الطلب.';
  const image = item?.imageUrl ? [item.imageUrl] : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image,
    },
  };
}

export default function MenuItemPage({ params }: { params: { id: string } }) {
  return <MenuItemClient id={params.id} />;
}
