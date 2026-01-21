'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Sparkles, UtensilsCrossed } from 'lucide-react';
import { CategoryFilter, SearchBar, MenuGrid } from '@/components/menu';
import { Toast, useToast, CategorySkeleton, PageError } from '@/components/ui';
import { fetchMenu, fetchCategories } from '@/lib/api';
import type { MenuItem, Category } from '@/types';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toasts, showToast, removeToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [menuResponse, categoriesResponse] = await Promise.all([
        fetchMenu(1, 100),
        fetchCategories(),
      ]);

      setItems(menuResponse.data || menuResponse || []);
      setCategories(categoriesResponse || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'فشل تحميل القائمة';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory) {
      result = result.filter((item) => item.category?.id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.nameAr.includes(searchQuery) ||
          item.description?.toLowerCase().includes(query) ||
          item.descriptionAr?.includes(searchQuery)
      );
    }

    return result;
  }, [items, selectedCategory, searchQuery]);

  const handleAddToOrder = useCallback((item: MenuItem) => {
    showToast(`تمت إضافة ${item.nameAr} إلى السلة`, 'info');
  }, [showToast]);

  if (error && !loading) {
    return <PageError message={error} onRetry={loadData} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-800 text-white py-12 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full" />
        </div>

        <div className="container-app relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent-300" />
              <span className="text-sm">تجربة الواقع المعزز</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 animate-fade-in">
              قائمة الطعام
            </h1>
            <p className="text-lg md:text-xl text-primary-300 mb-8 animate-slide-up">
              اكتشف أشهى الأطباق وشاهدها بتقنية الواقع المعزز قبل الطلب
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto animate-slide-up">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/60"
              />
            </div>
          </div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto">
            <path
              d="M0 80V40C240 0 480 20 720 40C960 60 1200 40 1440 0V80H0Z"
              fill="#FBFAF9"
            />
          </svg>
        </div>
      </section>

      {/* Menu Content */}
      <section className="container-app py-8 md:py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-serif font-semibold text-primary">التصنيفات</h2>
          </div>
          {loading ? (
            <CategorySkeleton />
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-primary-500">
              {filteredItems.length} عنصر
              {selectedCategory && ` في ${categories.find((c) => c.id === selectedCategory)?.nameAr || 'هذا التصنيف'}`}
            </p>
            {searchQuery && (
              <p className="text-sm text-accent">
                نتائج البحث: &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        )}

        {/* Menu Grid */}
        <MenuGrid
          items={filteredItems}
          loading={loading}
          onAddToOrder={handleAddToOrder}
        />
      </section>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
