'use client';

import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="relative">
      {/* Gradient Edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-4 -mx-4">
        {/* All Categories Button */}
        <button
          onClick={() => onSelect('')}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
            selectedCategory === ''
              ? 'bg-accent text-white shadow-button'
              : 'bg-white text-primary border border-primary-200 hover:border-accent hover:text-accent'
          )}
        >
          الكل
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              selectedCategory === category.id
                ? 'bg-accent text-white shadow-button'
                : 'bg-white text-primary border border-primary-200 hover:border-accent hover:text-accent'
            )}
          >
            {category.nameAr || category.name}
            {category._count?.items !== undefined && (
              <span className="mr-1.5 text-xs opacity-70">
                ({category._count.items})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
