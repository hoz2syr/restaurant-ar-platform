'use client';

import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, onDismiss, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in',
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            حاول مرة أخرى
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({ message = 'حدث خطأ أثناء تحميل البيانات', onRetry }: PageErrorProps) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-8">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <p className="text-lg text-primary-600 mb-4">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            حاول مرة أخرى
          </button>
        )}
      </div>
    </div>
  );
}
