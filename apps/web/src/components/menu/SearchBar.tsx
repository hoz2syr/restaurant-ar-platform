'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'ابحث عن طبقك المفضل...', className }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pr-10 pl-10"
        dir="rtl"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary transition-colors"
          aria-label="مسح البحث"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
